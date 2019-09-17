# Features

## Create modal to listen to that album RIGHT NOW
After modal open, generate an iframe to insert an embedded player
Use the album's URI so it shows the whole album
https://developer.spotify.com/documentation/widgets/generate/play-button/

## Have an option to view all albums, including seen
Would need a new UI for this
Need a way to reset an artist because I mistakenly marked all of Krewella as seen

## Introduce hamburger on the right for consolidating actions

## Use History so when user presses back and a modal is open it closes it

## Show in the album actions (mobile/desktop) if the album is currently seen or unseen

## Make the rocket ship take off on click
```css
.mark-as-seen-button {
    animation: takeoff .3s linear;
    animation-fill-mode: forwards;
}

@keyframes takeoff {
    from {
        transform: translate(0, 0);
    }

    to {
        transform: translate(50px, -50px);
    }
}
```

# Bugs

## The spotify access token expires but I don't have code that gets a new one if this happens so the request will fail
Use case is a user (me) sets a bunch of albums as seen but doesn't submit it

## Request throttling still doesn't work
It fails at "Uh oh, the retry after throttle failed too" with a 429, suggesting the throttling is not working

## Going to landscape breaks the mobile experience

## Got a 203/203 during a refresh, but then also got the error true. Not sure how that even happened.

# Chores

## LESS
Standardize colors, font sizes and paddings/margins

## Convert to TypeScript

## Generate a new client secret with spotify
Then add a heroku config for it and reference that in the code
For local development, I'll need to keep the secret handy outside of git, maybe read it from a file somewhere and make same env var that heroku uses

## Add robots.txt?

## Don't log error message for 404s
