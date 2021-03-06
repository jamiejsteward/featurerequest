# Feature Request App

[<img src="static/screenshot.png" width="100%" />](http://flask-env.ixduwmwhpm.us-east-2.elasticbeanstalk.com/).

## Functionality
A "feature request" is a request for a new feature that will be added onto an existing piece of
software. Assume that the user is an employee who would be entering this information after
having some correspondence with the client that is requesting the feature. The necessary fields
are:

- **Title:** A short, descriptive name of the feature request.
- **Description:** A long description of the feature request.
- **Client:** A selection list of clients (use "Client A", "Client B", "Client C")
- **Client Priority:** A numbered priority according to the client (1...n). Client Priority numbers
  should not repeat for the given client, so if a priority is set on a new feature as "1", then all
  other feature requests for that client should be reordered.
- **Target Date:** The date that the client is hoping to have the feature.
- **Product Area:** A selection list of product areas (use 'Policies', 'Billing', 'Claims',
  'Reports')


## Tech Stack
This project was built using the following:

* **Browser Scripting:** KnockoutJS
* **Browser Framework:** Bootstrap 
* **Browser Testing:** Selenium
* **Server Scripting:** Python 3.5
* **Server Framework:** Flask
* **Server Testing:** unittest
* **Database Mapping:** Sql-Alchemy
* **Database Server:** MySQL

## Getting Started

To view the working application click here: [Feature Request App](http://flask-env.ixduwmwhpm.us-east-2.elasticbeanstalk.com/).

These instructions will give you a local repository on your machine which you can then run and use. It assumes you have pip installed already.

By default the app uses SQLlite locally, you can update the **SQLALCHEMY_DATABASE_URI** variable to point at your MySQL database.

The application utilizes MVVC architecture; HTML tables, fields and buttons are bound to KnockoutJS objects, which call REST endpoints served up via Flask:  [Sortable Resource](http://flask-env.ixduwmwhpm.us-east-2.elasticbeanstalk.com/features/?order=client&dir=desc)

```
git clone git@github.com:jamiejsteward/featurerequest.git
pip install -r requirements.txt
python application.py
```

Look for the line 'Running on [localhost url]'. Navigate to this url, by default its [http://127.0.0.1:5000/](http://127.0.0.1:5000/).

## Testing & Deploying

Unit tests launch a Flask shell and tests specific HTTP endpoints.

```
python test.py
```

The easiest way to deploy on AWS is to install [Elastic Beanstalk Command Line Interface](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html).

```
eb init --profile <name>
eb deploy
```

E2E browser tests launch a Chrome browser and control it using Selenium's webdriver.

```
pip install selenium
brew install chromedriver
python driver.py
```


<img src="static/me-profile.png" width="70px" />

[Jamie Steward](https://www.linkedin.com/in/jamiesteward/)

