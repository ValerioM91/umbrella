# umbrella
A weather forecast app

I created a weather forecast app using the Open Weather API. The app
makes a request to a JSON file to get a list of all the cities that
the API covers. Once the city as been selected, it makes three request
to the API. One to retrieve the data at the time of the request, the
second one to get the daily data to display in the nav, finally the
third one to get the hourly data.

Since the cities list JSON file is really heavy (it is provided by the Open Weather API), I implemented the lodash library to make the function run only once and so improve performances. Using the memoize method from lodash, the JSON file is downloaded only on the first request.
