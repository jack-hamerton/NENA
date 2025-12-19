{
  pkgs, ...
}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    (pkgs.python311.withPackages
      (ps: with ps; [
        pip
        pytest
        aiosmtplib
        alembic
        annotated-types
        anyio
        apscheduler
        bcrypt
        blinker
        boto3
        botocore
        certifi
        cffi
        charset-normalizer
        click
        cryptography
        dnspython
        ecdsa
        email-validator
        fastapi
        fastapi-mail
        greenlet
        h11
        httptools
        idna
        jinja2
        jmespath
        kafka-python
        mako
        markupsafe
        passlib
        pyasn1
        pycparser
        pydantic
        pydantic-core
        pydantic-settings
        python-dateutil
        python-dotenv
        python-jose
        python-multipart
        pytz
        pyyaml
        redis
        regex
        requests
        rsa
        s3transfer
        six
        sqlalchemy
        starlette
        tzlocal
        typing-extensions
        urllib3
        uvicorn
        uvloop
        watchfiles
        websockets
        gunicorn
      ]))
    pkgs.nodejs_22
    pkgs.alembic
    pkgs.postgresql
    pkgs.curl
    pkgs.docker
    pkgs.docker-compose
    pkgs.pkg-config
  ];
}
