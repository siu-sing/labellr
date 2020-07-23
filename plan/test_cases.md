

1. Login as Client and access /admin/dashboard should return a flash error
2. Login as Labeller and access /admin/dashboard and /client/dashboard, client/create should return a flash error
3. Login as Admin and access /admin/dashboard, /client/dashboard/

- create admin
- create client1, create amazon job, upload csv
- create client2, create hotels job, upload csv
- create john, jane
- john to label amazon
- jane to label hotels to completion

- check labeller workflows and dashboard
- check client dashboard
- check labeller account page
- check admin dashboard

#### Demo Flow
1. Sign up Client and sign in
2. Create Job
3. Upload grab reviews
4. Publish job
5. Sign out


1. Sign up user and sign in
2. Look at available work flows, select a job, label
3. Sign out and sign in with another and label the new job
4. Sign out

1. Sign back in with original client to view results
2. Download results

Appendix
- Admin Dashboard
- Usage of cards for reuseability
- Calculating stats
- Model states


### Demo Flow
1. Overview of model - User (Client, Labeller), Jobs, Text
2. Create client1, create new sentiment workflow, not published
3. Upload csv text, check upload success, hit publish, show empty stats
4. Create john, view available workflows dashboard, start labelling, stop halfway
5. Go back to dashboard, all workflows should show nothing, dashboard should show in progress
6. Login as jane, complete labelling of grab sentiment
7. Login as jack, complete labelling of grab sentiment
8. Login as client1, view summary stats, close workflow, and download csv
9. Create new workflow, topic labelling of grab reviews
10. Login as john, label topics, complete, go back to dashboard
11. End