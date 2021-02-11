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
}

export interface LaravelFortifyOptions extends CookieSchemeOptions {
  endpoints: LaravelFortifyEndpoints
}

const DEFAULTS: SchemePartialOptions<LaravelFortifyOptions> = {
  name: 'laravelFortify',
  endpoints: {
    twoFactorChallenge: {
      url: '/api/two-factor-challenge',
      method: 'post',
    },
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
  ): Promise<HTTPResponse | void> {
    try {
      const response = await this.$auth.request(
        endpoint,
        this.options.endpoints.twoFactorChallenge
      )
      await this._login(response)
      return response
    } catch (e) {
      this.$auth.reset()
    }
  }

  reset(): void {
    this.$auth.$storage.setState('twoFA', false)

    return super.reset()
  }
}
