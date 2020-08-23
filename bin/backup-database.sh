#!/usr/bin/env bash

#If you have mongodb tools installed (brew tap mongodb/brew; brew install mongodb-database-tools), then you can use this to export the entire database into a JSON file
#This template was generated at https://cloud.mongodb.com/v2/5d547f839ccf643d3ff713bc#clusters/commandLineTools/hobby-cluster
mongoexport \
    --uri mongodb+srv://admin:F8cHHZjWza0SRGOx@hobby-cluster-f6tmy.mongodb.net/spotify-notify \
    --collection user-data \
    --type json \
    --out "../../db-backups/spotify-notify-$(date '+%Y-%m-%d').json"
