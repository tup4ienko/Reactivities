import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityPlaceholderItem from './ActivityPlaceholderItem';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, setPagingParams, pagiantion } = activityStore;
  const [loagingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagiantion!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry.size]);

  return (
    <Grid>
      <Grid.Column width='10'>
        {activityStore.loadingInitial && !loagingNext ? (
          <>
            <ActivityPlaceholderItem />
            <ActivityPlaceholderItem />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loagingNext && !!pagiantion && pagiantion.currentPage < pagiantion.totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width='6'>
        <div className='activity-filter'>
          <ActivityFilters />
        </div>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loagingNext} />
      </Grid.Column>
    </Grid>
  );
});
