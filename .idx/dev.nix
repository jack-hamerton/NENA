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
    pkgs.nodejs_20
    pkgs.alembic
    pkgs.postgresql
    pkgs.curl
    pkgs.python311Packages.pytest
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
