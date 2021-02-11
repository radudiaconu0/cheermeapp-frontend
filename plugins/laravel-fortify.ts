import { Plugin } from '@nuxt/types'
import { HTTPRequest, HTTPResponse } from '@nuxtjs/auth-next'
import LaravelFortify from '~/schemes/laravel-fortify'

declare module '@nuxtjs/auth-next' {
  interface Auth {
    twoFactorChallenge(endpoint: HTTPRequest): Promise<HTTPResponse | void>
  }
}

const laravelFortify: Plugin = ({ $auth }) => {
  // Add `twoFactorChallenge` method to `$auth`
  $auth.twoFactorChallenge = async (
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | void> => {
    if (
      // TODO: Remove unknown assertion
      !($auth.getStrategy() as LaravelFortify).twoFactorChallenge
    ) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).twoFactorChallenge(endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'twoFactorChallenge' })
      return await Promise.reject(error)
    }
  }

  // Set inital state of `twoFA`
  $auth.$storage.setState('twoFA', false)
}

export default laravelFortify
