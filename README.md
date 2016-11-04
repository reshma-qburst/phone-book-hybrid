# PhoneGap blank Template [![bitHound Score][bithound-img]][bithound-url]

Create a PhoneGap blank template.

## Usage

Browser, iOS and android devices.

## Features

A simple phone book hybrid app to add contacts, view contacts, edit & delete them.
Search functionality has also been implemented.

#### PhoneGap CLI for Phone Book App

phonegap create phone-book-hybrid

phonegap create phone-book-hybrid --template blank

To see a list of other available PhoneGap templates:

    phonegap template list

## [config.xml][config-xml]

Contains all configurations required for the app.

## [www/index.html][index-html]

Root file of the app. Changes are made in this file and while doing build corresponding files are generated in platform specific folders.

## hooks

Cordova Hooks represent special scripts which could be added by application and plugin developers or even by your own build system  to customise cordova commands.

## platforms

Holds build for different platforms.

## plugins

Holds different Cordova plugins.

## www

Root folder of the project.

## [www/res]

Holds icon and splash screen images for different platforms.

## [www/spec]

For JavaScript unit testing using Jasmine, a BDD (Behaviour Driven Development) testing framework for JavaScript.

## PhoneGap Build

https://github.com/reshma-qburst/phone-book-hybrid

#### android-minSdkVersion (Android only)

Minimum SDK version supported on the target device. Maximum version is blank by default.

This template sets the minimum to `14`.

    <preference name="android-minSdkVersion" value="14" />

#### &lt;access ...&gt; (All)

This template defaults to wide open access.

    <access origin="*" />

It is strongly encouraged that you restrict access to external resources in your application before releasing to production.

For more information on whitelist configuration, see the [Cordova Whitelist Guide][cordova-whitelist-guide] and the [Cordova Whitelist Plugin documentation][cordova-plugin-whitelist]

#### Content Security Policy (CSP)

The default CSP is similarly open:

    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *" />

Much like the access tag above, you are strongly encouraged to use a more restrictive CSP in production.

A good starting point declaration might be:

    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: 'unsafe-inline' https://ssl.gstatic.com; style-src 'self' 'unsafe-inline'; media-src *" />

For more information on the Content Security Policy, see the [section on CSP in the Cordova Whitelist Plugin documentation][cordova-plugin-whitelist-csp].

Another good resource for generating a good CSP declaration is [CSP is Awesome][csp-is-awesome]