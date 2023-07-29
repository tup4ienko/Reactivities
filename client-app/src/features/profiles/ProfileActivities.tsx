import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { Card, Grid, Header, Image, Tab, TabProps } from 'semantic-ui-react';
import { useEffect, SyntheticEvent } from 'react';
import { UserActivity } from '../../app/models/profile';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const panes = [
  { menuItem: 'Future Event', pane: { key: 'future' } },
  { menuItem: 'Past Event', pane: { key: 'past' } },
  { menuItem: 'Hosting Event', pane: { key: 'hosting' } },
];

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const { profile, loadUserActivities, loadingActivities, userActivities } = profileStore;

  useEffect(() => {
    loadUserActivities(profile!.username);
  }, [loadUserActivities, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key);
  };

  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Activities'} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{activity.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                    <div>{format(new Date(activity.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
