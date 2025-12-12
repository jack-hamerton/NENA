{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.twilio
    pkgs.nodejs_20
    pkgs.alembic
    pkgs.postgresql
    pkgs.curl
    pkgs.docker
    pkgs.docker-compose
  ];
}
