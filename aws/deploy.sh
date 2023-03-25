#!/bin/bash

cd $(dirname ${0})/..

npm run build

ionic cap copy

ionic cap open android

#chmod u+x deploy-in-aws.sh I did that on the server the first time 