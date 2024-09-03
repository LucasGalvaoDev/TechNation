# Use a imagem base do .NET SDK 6.0 para construir a aplicação
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copie os arquivos csproj e restaure as dependências
COPY *.csproj ./
RUN dotnet restore

# Copie o restante dos arquivos e compile a aplicação
COPY . ./
RUN dotnet publish -c Release -o out

# Use a imagem base do .NET Runtime 6.0 para executar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Defina a porta na qual o aplicativo escuta
EXPOSE 80

# Defina o ponto de entrada da aplicação
ENTRYPOINT ["dotnet", "TechNationEx.dll"]
