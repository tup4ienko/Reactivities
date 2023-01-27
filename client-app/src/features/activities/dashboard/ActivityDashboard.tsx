import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { router } from '../../../app/router/Routes';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';


export default observer(function ActivityDashboard() {
    const {activityStore, userStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;
    
    useEffect(() => {
        if (!userStore.isLoggedIn) router.navigate('/')
        if (activityRegistry.size <= 1) loadActivities()
    }, [loadActivities, activityRegistry.size, userStore])
  
    
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
});