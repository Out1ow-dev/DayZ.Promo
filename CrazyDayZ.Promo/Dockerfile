FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

USER root
# Создаем директории и устанавливаем права
RUN mkdir -p /app/wwwroot/qr-codes && \
    mkdir -p /app/wwwroot/promo-images && \
    mkdir -p /app/wwwroot/images && \
    chown -R 1000:1000 /app && \
    chmod -R 777 /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CrazyDayZ.Promo.csproj", "."]
RUN dotnet restore "CrazyDayZ.Promo.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "CrazyDayZ.Promo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CrazyDayZ.Promo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Создаем пользователя и группу
RUN addgroup --system --gid 1000 appgroup && \
    adduser --system --uid 1000 --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app && \
    chmod -R 777 /app

USER 1000
ENTRYPOINT ["dotnet", "CrazyDayZ.Promo.dll"]