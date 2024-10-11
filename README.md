# Playwright Automation Test

This repository contains Playwright automation tests for our project. Follow the instructions below to set up and run the tests.

## Prerequisites

Before you can run the tests, make sure you have the following installed:

1. **Node.js** (version 20 or above) - Download and install from [Node.js](https://nodejs.org/).
2. **Git** - Download and install from [Git](https://git-scm.com/).
3. **Visual Studio Code** - A text editor. Download from [Visual Studio Code](https://code.visualstudio.com/).
4. **Playwright** - Install Playwright using npm.

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

## Running Tests

To run the tests, use the following commands for each project:

### Neighborhood91

```bash
npx playwright test Neighborhood91/neighborhood91.spec.js
```

### Pittransformed

```bash
npx playwright test Pittransformed/pittransformed.spec.js
```

### Blueskypit

```bash
npx playwright test Blueskypit/blueskypit.spec.js
```

### Flypittsburgh

#### General Tests

```bash
npx playwright test flypittsburgh/Fly_PIT/fly_pit.spec.js
npx playwright test flypittsburgh/Fly_ACAA/fly_acaa.spec.js
npx playwright test flypittsburgh/Fly_AGC/fly_agc.spec.js
```

#### API Response Test

```bash
npx playwright test flypittsburgh/Flight_Api_Response/flight_api_response.spec.js
```

#### Flight Filter Test

```bash
npx playwright test flypittsburgh/Filters_Search/filters_search.spec.js
```

## Show the Report

To view the test report, use the command:

```bash
npx playwright show-report
```

## Update the Screenshots

To update the screenshots, run the following commands for each project:

### Neighborhood91

```bash
npx playwright test Neighborhood91/neighborhood91.spec.js --update-snapshots
```

### Pittransformed

```bash
npx playwright test Pittransformed/pittransformed.spec.js --update-snapshots
```

### Blueskypit

```bash
npx playwright test Blueskypit/blueskypit.spec.js --update-snapshots
```

### Flypittsburgh

#### General Tests

```bash
npx playwright test flypittsburgh/Fly_PIT/fly_pit.spec.js --update-snapshots
npx playwright test flypittsburgh/Fly_ACAA/fly_acaa.spec.js --update-snapshots
npx playwright test flypittsburgh/Fly_AGC/fly_agc.spec.js --update-snapshots
```

#### API Response Test

```bash
npx playwright test flypittsburgh/Flight_Api_Response/flight_api_response.spec.js --update-snapshots
```

#### Flight Filter Test

```bash
npx playwright test flypittsburgh/Filters_Search/filters_search.spec.js --update-snapshots
```
