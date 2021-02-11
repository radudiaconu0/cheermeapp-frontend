import type {
  TokenableScheme,
  HTTPRequest,
  HTTPResponse,
  SchemePartialOptions,
  CookieSchemeOptions,
  SchemeCheck,
} from '@nuxtjs/auth-next'

import { Auth, LocalScheme } from '~auth/runtime'

const DEFAULTS: SchemePartialOptions<CookieSchemeOptions> = {
  name: 'cookie',
  cookie: {
    name: undefined,
  },
  token: {
    type: '',
    property: '',
    maxAge: false,
    global: false,
    required: false,
  },
  endpoints: {
    csrf: undefined,
  },
}

export default class CookieScheme<
    OptionsT extends CookieSchemeOptions = CookieSchemeOptions
  >
  extends LocalScheme<OptionsT>
  implements TokenableScheme<OptionsT> {
  constructor(
    $auth: Auth,
    options: SchemePartialOptions<CookieSchemeOptions>,
    ...defaults: SchemePartialOptions<CookieSchemeOptions>[]
  ) {
    super($auth, options, ...defaults, DEFAULTS)
  }

  mounted(): Promise<HTTPResponse | void> {
    if (process.server) {
      this.$auth.ctx.$axios.setHeader(
        'referer',
        this.$auth.ctx.req.headers.host
      )
    }

    return super.mounted()
  }

  check(): SchemeCheck {
    const response = { valid: false }

    if (!super.check().valid) {
      return response
    }

    if (this.options.cookie.name) {
      const cookies = this.$auth.$storage.getCookies()
      response.valid = Boolean(cookies[this.options.cookie.name])
      return response
    }

    response.valid = true
    return response
  }

  async login(endpoint: HTTPRequest): Promise<HTTPResponse> {
    // Ditch any leftover local tokens before attempting to log in
    this.$auth.reset()

    // Make CSRF request if required
    await this.csrf()

    return super.login(endpoint, { reset: false })
  }

  async csrf(): Promise<HTTPResponse | void> {
    if (!this.options.endpoints.csrf) {
      return
    }

    return await this.$auth.request(this.options.endpoints.csrf, {
      maxRedirects: 0,
    })
  }

  reset(): void {
    if (this.options.cookie.name) {
      this.$auth.$storage.setCookie(this.options.cookie.name, null, {
        prefix: '',
      })
    }

    return super.reset()
  }
}
