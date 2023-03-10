# nix-channel --update nixpkgs
# ^^ Update nixpkgs occasionally

let
  # https://nixos.wiki/wiki/FAQ/Pinning_Nixpkgs
   pkgs = import <nixpkgs> {
       config = {
      allowUnfree = true;
      cudaSupport = true;
   };
   };
  #pkgs = import (builtins.fetchTarball {
    # Descriptive name to make the store path easier to identify
    # name = "nixpkgs-2021-01-03";
    # Find the current commit hash with:
    # `curl "https://releases.nixos.org/nixpkgs/nixpkgs-$(nix-instantiate --eval -E '(import <nixpkgs> {}).lib.version' | tr -d '"')/git-revision" && echo`
    # url = "https://github.com/nixos/nixpkgs/archive/2080afd039999a58d60596d04cefb32ef5fcc2a2.tar.gz";
    # Hash obtained using: `nix-prefetch-url --unpack <url>`
    # sha256 = "0i677swvj8fxfwg3jibd0xl33rn0rq0adnniim8jnp384whnh8ry";
 # }) {};
  #];

   pyInputs = with pkgs.python38Packages; [
      pkgs.python38
      virtualenv
      virtualenvwrapper
      pip
   ];

in pkgs.stdenv.mkDerivation rec {
   name = "cuda-env-shell";
   env_home = "Development";
   repo = "sd-ui";
   req_location = "requirements_versioned.txt";

   buildInputs = with pkgs; [
      pyInputs
      git gitRepo gnupg autoconf curl
      procps gnumake util-linux m4 gperf unzip
      cudatoolkit linuxPackages.nvidia_x11
      libGLU libGL
      xorg.libXi xorg.libXmu freeglut
      xorg.libXext xorg.libX11 xorg.libXv xorg.libXrandr zlib 
      ncurses5 stdenv.cc binutils
      glib
      conda
      yarn
   ];
   
   LD_LIBRARY_PATH="${pkgs.linuxPackages.nvidia_x11}/lib:${pkgs.ncurses5}/lib:${pkgs.glib.out}/lib:$LD_LIBRARY_PATH";
   shellHook = ''
      # set SOURCE_DATE_EPOCH so that we can use python wheels
      SOURCE_DATE_EPOCH=$(date +%s)
      
      # ENV_HOME
      export ENV_HOME="$HOME/${env_home}/${repo}"
      export PYTHONPATH="$PYTHONPATH:$ENV_HOME"

      # use virtualenvwrapper to manage envs
      export WORKON_HOME="$ENV_HOME/Envs"
      mkdir -p $WORKON_HOME
      source $(command -v virtualenvwrapper.sh)

      # install
      mkvirtualenv ${name}
      workon ${name}
      python3 -m pip install -r "$ENV_HOME/${req_location}"

      # optional
      python $ENV_HOME/jupyter_rename.py --repo=${repo} --name=${name}
      python $ENV_HOME/requirements_versioned.py --repo=${repo}
      pip list --format=freeze > requirements_versioned_full.txt

      # prompt that says the derivation
      PS1="\[\033[1;34m\][nix-shell-${name}:\w]\n\$ \[\033[0m\]"
      
      export CUDA_PATH="${pkgs.cudatoolkit}"
      # export LD_LIBRARY_PATH="${pkgs.linuxPackages.nvidia_x11}/lib:${pkgs.ncurses5}/lib:${pkgs.glib.out}/lib"
      export EXTRA_LDFLAGS="-L/lib -L${pkgs.linuxPackages.nvidia_x11}/lib"
      export EXTRA_CCFLAGS="-I/usr/include"
      conda-shell
      conda activate webui2
   '';  
}
