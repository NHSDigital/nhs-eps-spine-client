FROM mcr.microsoft.com/devcontainers/base:ubuntu

# System updates
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y dist-upgrade \
    && apt-get -y install --no-install-recommends \
    git make

# Python dependencies
RUN apt-get -y install --no-install-recommends \
    libffi-dev libsqlite3-dev

USER vscode

# Install ASDF
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.3; \
    echo '. $HOME/.asdf/asdf.sh' >> ~/.bashrc; \
    echo '. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc;

ENV PATH="$PATH:/home/vscode/.asdf/bin/:/workspaces/nhs-eps-spine-client/node_modules/.bins:/home/vscode/.asdf/shims"

# Install ASDF plugins
RUN asdf plugin add python; \
    asdf plugin add poetry https://github.com/asdf-community/asdf-poetry.git; \
    asdf plugin add shellcheck https://github.com/luizm/asdf-shellcheck.git; \
    asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git; \
    asdf plugin-add direnv; \
    asdf plugin add actionlint;

WORKDIR /workspaces/nhs-eps-spine-client
ADD .tool-versions /workspaces/nhs-eps-spine-client/.tool-versions
ADD .tool-versions /home/vscode/.tool-versions

RUN asdf install python && asdf reshim python
RUN asdf install poetry && asdf reshim poetry

RUN asdf install; \
    asdf reshim nodejs; \
    asdf direnv setup --shell bash --version 2.32.2;
