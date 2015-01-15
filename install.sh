#!/usr/bin/env bash

echo go get -u ......

@go get -u github.com/gohttp/response
@go get -u github.com/gohttp/logger
@go get -u github.com/gohttp/statsd
@go get -u github.com/gohttp/mount
@go get -u github.com/gohttp/serve
@go get -u github.com/gohttp/pprof
@go get -u github.com/tj/go-debug
@go get -u github.com/gohttp/app

echo check docker

echo install docker

echo check drone

echo install drone
