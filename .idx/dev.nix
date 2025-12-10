{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.fastapi
    pkgs.python311Packages.uvicorn
    pkgs.python311Packages.sqlalchemy
    pkgs.python311Packages.pydantic
    pkgs.python311Packages.redis
    pkgs.python311Packages.aioredis
    pkgs.python311Packages.psycopg2
    pkgs.nodejs_20
    pkgs.alembic
    pkgs.postgresql
    pkgs.curl
    pkgs.python311Packages.pytest
    pkgs.docker
    pkgs.docker-compose
    pkgs.python311Packages.aiosmtplib
    pkgs.python311Packages.annotated-types
    pkgs.python311Packages.anyio
    pkgs.python311Packages.apscheduler
    pkgs.python311Packages.bcrypt
    pkgs.python311Packages.blinker
    pkgs.python311Packages.boto3
    pkgs.python311Packages.botocore
    pkgs.python311Packages.certifi
    pkgs.python311Packages.cffi
    pkgs.python311Packages.charset-normalizer
    pkgs.python311Packages.click
    pkgs.python311Packages.cryptography
    pkgs.python311Packages.dnspython
    pkgs.python311Packages.ecdsa
    pkgs.python311Packages.email-validator
    pkgs.python311Packages.fastapi-mail
    pkgs.python311Packages.greenlet
    pkgs.python311Packages.h11
    pkgs.python311Packages.httptools
    pkgs.python311Packages.idna
    pkgs.python311Packages.jinja2
    pkgs.python311Packages.jmespath
    pkgs.python311Packages.kafka-python
    pkgs.python311Packages.mako
    pkgs.python311Packages.markupsafe
    pkgs.python311Packages.passlib
    pkgs.python311Packages.pyasn1
    pkgs.python311Packages.pycparser
    pkgs.python311Packages.pydantic-settings
    pkgs.python311Packages.python-dateutil
    pkgs.python311Packages.python-dotenv
    pkgs.python311Packages.python-jose
    pkgs.python311Packages.python-multipart
    pkgs.python311Packages.pytz
    pkgs.python311Packages.pyyaml
    pkgs.python311Packages.regex
    pkgs.python311Packages.requests
    pkgs.python311Packages.rsa
    pkgs.python311Packages.s3transfer
    pkgs.python311Packages.six
    pkgs.python311Packages.starlette
    pkgs.python311Packages.tzlocal
    pkgs.python311Packages.typing-extensions
    hpkgs.python311Packages.typing-inspection
    pkgs.python311Packages.urllib3
    pkgs.python311Packages.uvloop
    pkgs.python311Packages.watchfiles
    pkgs.python311Packages.websockets
    pkgs.python311Packages.gunicorn

    # pkgs.nodePackages.nodemon
  ];

  # Sets environment variables in the workspace
  # env = {
  #   ENV_VAR = "value";
  # };

  # Overrides nixpkgs configuration
  # nixpkgs.config = {
  #   # Disable adding "-dev" to python package names
  #   python.devSuffix = false;
  #
  #   # Allow unfree packages
  #   allowUnfree = true;
  # };

  # Lets you customize the shell hook
  # shell.hook = ''
  #   echo "Welcome to your Nix development shell!"
  #   # Run a command when the shell starts
  #   npm install
  # ''

  # starship.enable = true;
}
