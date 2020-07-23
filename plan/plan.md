### Sprints
Keeping track of the tasks in my sprints here. Each sprint is roughly half a day (4 to 5 hours).

At the beginning of the project the basic framework had to be set up, and since we have done it in class many times, I went straight into it without having to write user-stories. 

As I moved further along in my project, I had thoughts of features that should be developed specific to different aspects of the app. To organise these ideas without disrupting my flow of thought during the sprint, I recorded these ideas as user-stories in the backlog.

At the end of each sprint, I looked over the backlog and select 3 to 4 items that I thought would be achievable within the sprint, and also kept in mind to have a good mix of FE/BE features each sprint.

*** - Indicates a feature that was / (I expect to be) challenging to implement.


#### Sprint 1 - Initial planning
1. Wire frames
    - landing page, login, sign up
    - dashboards
        - Admin Dashboard
        - Labeller workflows, current jobs
        - Client dashboard
    - Labelling page
2. Models - fields and relationships
    - User
        - Admin
        - Labeller
        - Client
    - Job, Text, Image

#### Sprint 2 - Core routes and displays
1. CRUD for User
    - Register, Log in, Edit, View
2. CRUD for Jobs
3. Admin Dashboard - view all users and object at a glance

#### Sprint 3 - Text object and Auth checks
1. CRUD for Text - create (manual entry), view, delete
2. Authentication

#### Sprint 4 - Job states, labelling logic
1. As a client, I want to be able to control the states of the job I am managing, so that I only publish when I am ready, and close once I am satisfied.
    - Jobs states: not started, in progres, closed
2. *** As a labeller, I want to be able to view published jobs and select them for labelling, and not show these jobs as available - Workflows Available page
3. As a labeller, I want to be able to label data, and stop labelling once I have completed all the data points
4. As a labeller, I want to view the jobs i have currently signed up for and some basic stats on my progress for each job - Labeller Dashboard

#### Sprint 5 - Enhanced admin dashboard, Text upload via CSV
1. As an admin on the dashboard page, I would like to see basic stats of the number of users I have, instead of pure table display of all my users
2. *** As a client, I want to be able to upload text using a CSV file, instead of manually, so that I can upload a large set of text.
3. As a client, I should not be able to modify text after I have published my work flow.
4. As a client, I should not be able to delete my workflow. Only admins are allowed to delete workflows.

#### Sprint 6 - Focused labelling page, Summary stats for job
1. As a labeller, I want the labelling page to be more focused, so that I can labelled undistracted. And also have a counter to know how close I am to finish labelling
2. ***As a Client, I want to know for my jobs in progress, what is the basic stats of my labelling. Number of labellers, number of labelled data points, number of useful data points
3. As a labeller, I want to view my account details, the number of jobs I am taking on, and lifetime labels

#### Sprint 7 - Download results via CSV, Prep for next version
1. *** As a client, I want to be able to download all sentiment labels of my data via CSV to do further analysis. Reshape text data and labels into CSV
2. Create test cases to run everytime I do a major upgrade or change - in preparation for next version

#### Sprint 8 - Clean deletes, Front end tidy up
1. Clean deletes - if job is deleted, all text and references to the job and text needs to deleted as well
3. As a labeller on my dashboard, I would like to sort by jobs in progress, completed, add color
3. As a client on my dashboard, I would like to sort workflows by not started, in progress and closed
4. Format status names to show `Not Started` instead of `notStarted`
5. Progress bar for labelling instead of fraction

#### Sprint 9 - Version 1.1
1. As a client, i want to create a topic labelling workflow, and include a list of topics that i want to be labelled. There should be a default, "not sure", "na" selection.
    - a job can only be either topic or sentiment
    - input that collects topics for my workflow
    - client create routes must handle topic inputs
    - on job cards, show that its topic labelling and show the topics
2. As a labeller, I want to be able to do topic labelling for topic labelling workflows
    - labeller job card display must show the same info (which it will since its the same job card)
    - label page must display topics instead of sentiments

#### Backlogs
- Front end/UI/UX
    - Use moment to format dates
    - As a labeller on my dashboard, I would like to filter by jobs in progress, completed, add color
    - As a client on my dashboard, I would like to filter workflows by not started, in progress and closed
    - As an admin on my dashboard, I would like to view user stats based on user type
    - Add styling on cards to visually identify type of workflow being created
    - Add a footer for about us, labeller/client help, contact
    - As a labeller, I want the labelling screen to be compatible on smaller screens.
    - Validate all critical inputs - text data, topics
- Content
    - As a Client, I would like a Help page to understand how to set up workflows, and various rules/instructions to take note of
    - As a labeller, I would like a help page to undrstand how to start labelling, manage my jobs etc
- Back end
    - As a labeller, if the workflow is closed, i should not be able to continue labelling
    - App should be able to limit the number of labellers per job/text, currently there is no limit
- Version 1.1 - Topic labelling
    - Handle client predefined topics
- Version 2 - Image Labelling
    - ***Refactor/Update routes/displays to handle image labelling
        - Image Model
        - Update forms
        - Update job cards (new cards? or refactor existing cards?)
        - Update display page
        - Update routes to handle display (new routes or refactor existing text routes?)

#### Post Mortem/Thoughts during development
- is there a better way to organise views/buttons of the same card but for different users?
- forgot to delete text when deleting jobs, must plan deleting logic when building references between models
- tried to left join using mongo DB, switched to handling the exclusions by writing my own logic in js, how to decide to write mongoDB queries or handle them in pure js? Is it a question of efficiency?
- its hard to visualise the complete app before actually building parts of it, is this a solo developer thing? or should we always strive to wireframe/user-story the whole app before building? or wireframe during each sprint - i generally did this
- should probably randomise the texts instead of getting one labeller to label all. i.e. pull from texts that have been labelled less than X times.
- for each workflow, should have a smarter strategy in selecting which text to label - select only data that has not hit the X number of labels.
- there were alot of convenient features that was in the backlog, but for this project (due to tight timelines) i prioiritized functional features instead to ensure that core functionalities are delivered but sacrificing abit of the UX
