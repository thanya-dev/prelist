import { Sidebar } from '../components/layout/Sidebar.jsx';
import { PostingCalendarList } from '../features/job-postings/PostingCalendarList.jsx';
export function JobPostingListPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="list-main">
        <PostingCalendarList />
      </main>
    </div>
  );
}
