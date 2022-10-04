#!/bin/bash

codec="codec"

rm -rf ./$codec

for dir in ./src/*; do
    if [[ $(basename $dir) == utils || -f $dir ]]; then
        continue
    fi

    for file in $dir/*.ts; do
        echo "Compiling $file"

        mkdir -p ./${codec}/$(basename ${dir})
        npx esbuild "${file}" --bundle --log-level=error --platform=neutral --tree-shaking=false --outfile="./${codec}/$(basename ${dir})/$(basename "${file%.ts}.js")"

    done

done
