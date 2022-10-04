# Chirpstack Codecs

Environment for writing ergonomically codecs for chirpstack.

In the future we could also translate the functions to work with TTN if needed.

## Codecs

If you just want the javascript codecs, find all supported codecs in the `codec` folder.

## Adding a new codec

Clone the repository and create the new codec. Each codec should be in it's own file in `src/[vendor]`.

A special case is the `utils` folder which is where all common functions should be placed.

When you are done, run `./build.sh` to bundle the codecs into the `codec` folder. Also, we recommend adding:

```sh
#!/bin/sh

./build.sh
```

to `.git/hooks/pre-commit` or `.git/hooks/pre-push` to ensure that the codecs are always up to date.

Once you are done, create a pull request and we will review it.
