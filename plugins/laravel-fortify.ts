import { HTTPRequest, HTTPResponse } from '@nuxtjs/auth-next'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import LaravelFortify from '~/schemes/laravel-fortify'

declare module '@nuxtjs/auth-next' {
  interface Auth {
    twoFactorChallenge(
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>

    forgotPassword(
      strategy: string,
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>

    resetPassword(
      strategy: string,
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>

    emailVerify(
      strategy: string,
      id: string,
      hash: string,
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>

    register(
      strategy: string,
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>

    updatePassword(
      strategy: string,
      endpoint: HTTPRequest
    ): Promise<HTTPResponse | Error | void>
  }
}

export default defineNuxtPlugin(({ $auth }) => {
  // Add `twoFactorChallenge` method to `$auth`
  $auth.twoFactorChallenge = async (
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    if (!($auth.getStrategy() as LaravelFortify).twoFactorChallenge) {
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

  // Add `forgotPassword` method to `$auth`
  $auth.forgotPassword = async (
    strategy: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    await $auth.setStrategy(strategy)

    if (!($auth.getStrategy() as LaravelFortify).forgotPassword) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).forgotPassword(endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'forgotPassword' })
      return await Promise.reject(error)
    }
  }

  // Add `resetPassword` method to `$auth`
  $auth.resetPassword = async (
    strategy: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    await $auth.setStrategy(strategy)

    if (!($auth.getStrategy() as LaravelFortify).resetPassword) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).resetPassword(endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'resetPassword' })
      return await Promise.reject(error)
    }
  }

  // Add `emailVerify` method to `$auth`
  $auth.emailVerify = async (
    strategy: string,
    id: string,
    hash: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    await $auth.setStrategy(strategy)

    if (!($auth.getStrategy() as LaravelFortify).emailVerify) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).emailVerify(id, hash, endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'emailVerify' })
      return await Promise.reject(error)
    }
  }

  // Add `register` method to `$auth`
  $auth.register = async (
    strategy: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    await $auth.setStrategy(strategy)

    if (!($auth.getStrategy() as LaravelFortify).register) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).register(endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'register' })
      return await Promise.reject(error)
    }
  }
  $auth.updatePassword = async (
    strategy: string,
    endpoint: HTTPRequest
  ): Promise<HTTPResponse | Error | void> => {
    await $auth.setStrategy(strategy)

    if (!($auth.getStrategy() as LaravelFortify).updatePassword) {
      return Promise.resolve()
    }

    try {
      return Promise.resolve(
        ($auth.getStrategy() as LaravelFortify).updatePassword(endpoint)
      )
    } catch (error) {
      $auth.callOnError(error, { method: 'updatePassword' })
      return await Promise.reject(error)
    }
  }

  // Set inital state of `twoFA`
  $auth.$storage.setState('twoFA', false)
})

// export default laravelFortify
