Refresh token guide:
https://developer.spotify.com/documentation/general/guides/authorization-guide/#4-requesting-a-refreshed-access-token-spotify-returns-a-new-access-token-to-your-app

First:  
https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-followed

Then for each artist in first call:  
https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-an-artists-albums

Services allow max of 50 items per request, so need to use paging.
There are unknown rate limit caps, so try sending them all and then waiting on rejection



I want to be notified when there's new music.

I want to view results on a website when an artist I follow has an album I haven't seen before.

I need to get a list of all albums for all the artists I follow. Then I need to save that list.
N time later I need to get the list again, and compare it to the saved list.

If album IDs are globally unique, I can simply store the ID in a list. Then iterate through the new list and see each ID is in the old list. 

I can create a simple UI that says which albums are new, then click save to persist the new list.

Step 1:
Make an express server that uses the spotify api to authenticate my user and return list of artists I follow

Step 2:
Get list of all albums of artists I follow (create stubs if these are expensive calls) and use dirtydb or something to persist 

Step 3:
Persist the new album list

Step 4:
Get list of saved albums from db

Step 5:
Create react application that receives both lists and outputs them

Step 6:
Allow UI to save new album list

Step 7:
Diff the lists and output the diff

Step 8:
Find album art or something if possible for each item in the diff
