import {
  CookieSchemeOptions,
  CookieSchemeEndpoints,
  HTTPRequest,
  HTTPResponse,
  SchemePartialOptions,
} from '@nuxtjs/auth-next'

import CookieScheme from './cookie'
import { Auth } from '~auth/runtime'

export interface LaravelFortifyEndpoints extends CookieSchemeEndpoints {
  twoFactorChallenge: HTTPRequest
  forgotPassword: HTTPRequest
  resetPassword: HTTPRequest
  emailVerify: HTTPRequest
  register: HTTPRequest
  updatePassword: HTTPRequest
}

export interface LaravelFortifyOptions extends CookieSchemeOptions {
  endpoints: LaravelFortifyEndpoints
  loginOnRegister: boolean
}

const DEFAULTS: SchemePartialOptions<LaravelFortifyOptions> = {
  name: 'laravelFortify',
  endpoints: {
    twoFactorChallenge: {
      url: '/api/two-factor-challenge',
      method: 'post',
    },
    forgotPassword: {
      url: '/api/forgot-password',
      method: 'post',
    },
    resetPassword: {
      url: '/api/reset-password',
      method: 'post',
    },
    emailVerify: {
      url: '/api/email/verify',
      method: 'get',
    },
    register: {
      url: '/api/register',
      method: 'post',
    },
    updatePassword: {
      url: '/api/user/password',
      method: 'put',
    },
    loginOnRegister: false,
  },
}

export default class LaravelFortify<
  OptionsT extends LaravelFortifyOptions = LaravelFortifyOptions
> extends CookieScheme<OptionsT> {
  constructor(
    $auth: Auth,
    options: SchemePartialOptions<LaravelFortifyOptions>,
    ...defaults: SchemePartialOptions<LaravelFortifyOptions>[]
  ) {
    super($auth, options, ...defaults, DEFAULTS)
  }

  async login(endpoint: HTTPRequest): Promise<HTTPResponse> {
    // Ditch any leftover local tokens before attempting to log in
    this.$auth.reset()

    // Make CSRF request if required
    await this.csrf()

    if (!this.options.endpoints.login) {
      // @ts-ignore
      return
    }

    // Add client id to payload if defined
    if (this.options.clientId) {
      endpoint.data.client_id = this.options.clientId
    }

    // Add grant type to payload if defined
    if (this.options.grantType) {
      endpoint.data.grant_type = this.options.grantType
    }

    // Add scope to payload if defined
    if (this.options.scope) {
      endpoint.data.scope = this.options.scope
    }

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    )

    if (response.data.two_factor) {
      this.$auth.$storage.setState('twoFA', true)
    } else {
      await this._login(response)
    }

    return response
  }

  private async _login(response: HTTPResponse) {
    // Update tokens
    this.updateTokens(response)

    // Initialize request interceptor if not initialized
    if (!this.requestHandler.interceptor) {
      this.initializeRequestInterceptor()
    }

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser()
    }
  }

  async twoFactorChallenge(
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.twoFactorChallenge.url) {
      return Promise.reject(
        new Error('Endpoint of twoFactorChallenge is not defined.')
      )
    }

    try {
      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.twoFactorChallenge
      )
      await this._login(response)
      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async register(endpoint: HTTPRequest): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.register.url) {
      return Promise.reject(new Error('Endpoint of register is not defined.'))
    }

    try {
      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.register
      )

      if (this.options.loginOnRegister) {
        await this._login(response)
      }

      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async forgotPassword(endpoint: HTTPRequest): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.forgotPassword.url) {
      return Promise.reject(
        new Error('Endpoint of forgotPassword is not defined.')
      )
    }

    try {
      await this.csrf()

      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.forgotPassword
      )
      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async resetPassword(endpoint: HTTPRequest): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.resetPassword.url) {
      return Promise.reject(
        new Error('Endpoint of resetPassword is not defined.')
      )
    }

    try {
      await this.csrf()

      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.resetPassword
      )
      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async emailVerify(
    id: string,
    hash: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.emailVerify.url) {
      return Promise.reject(
        new Error('Endpoint of emailVerify is not defined.')
      )
    }

    if (!id) {
      return Promise.reject(new Error('ID of emailVerify is not defined.'))
    }

    if (!hash) {
      return Promise.reject(new Error('Hash of emailVerify is not defined.'))
    }

    let url = this.options.endpoints.emailVerify.url

    // Remove / from the end of path
    if (url.charAt(url.length - 1) === '/') {
      url = url.slice(0, -1)
    }

    endpoint.url = `${url}/${id}/${hash}`

    try {
      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.emailVerify
      )
      return response
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async updatePassword(endpoint: HTTPRequest): Promise<HTTPResponse | Error> {
    if (!this.options.endpoints.updatePassword.url) {
      return Promise.reject(
        new Error('Endpoint of updatePassword is not defined.')
      )
    }

    try {
      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.updatePassword
      )
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  reset(): void {
    this.$auth.$storage.setState('twoFA', false)
  }
}
