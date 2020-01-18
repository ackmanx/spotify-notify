#!/usr/bin/env bash

#If you have mongodb installed locally (brew tap mongodb/brew; brew install mongodb-community), then you can use this to export the entire database into a JSON file
#This template was generated at https://cloud.mongodb.com/v2/5d547f839ccf643d3ff713bc#clusters/commandLineTools/spotify-notify
mongoexport \
    --host spotify-notify-shard-0/spotify-notify-shard-00-00-f6tmy.mongodb.net:27017,spotify-notify-shard-00-01-f6tmy.mongodb.net:27017,spotify-notify-shard-00-02-f6tmy.mongodb.net:27017 \
    --ssl \
    --username admin \
    --password F8cHHZjWza0SRGOx \
    --authenticationDatabase admin \
    --db spotify-notify \
    --collection user-data \
    --out ../../db-backups/spotify-notify.json
