import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import AuthCallback from './auth/login-callback.tsx'
import ProtectedRoute from './auth/protected-route.tsx';
import LoginPage from './auth/login-page.tsx'
import SignUp from './auth/signup-page.tsx'
import CodeEditor from './app/example/coder.tsx';
import Dashboard from './app/home/dashboard/home-dashboard.tsx';
import LandingPage from './app/landing/main.tsx';
import Shell from './app/shell.tsx';
import ErrorPage from './app/error-page/error-page.tsx';
import MarketingAgent from './app/agents/marketing-agent/marketing-agent.tsx';
import ReportingAgent from './app/agents/reporting-agent.tsx';
import ExploreAgents from './app/agents/explore/explore-agents.tsx';
import DataEngineeringPipelines from './app/projects/data-pipelines/data-engineering-pipelines.tsx';
import DataSources from './app/home/data-sources/data-sources.tsx';
import NewDataSource from './app/home/data-sources/manual-new-data-source.tsx';
import DashboardBuilder from './app/dashboards/build-dashboard/dashboard-builder.tsx';
import PublishedDashboard from './app/dashboards/published/published-dashboard.tsx';
import MyDashboards from './app/home/my-dashboards/my-dashboards.tsx';
import MarketingDashboards from './app/projects/marketing-dashboards/marketing-dashboards.tsx';
import UnderstandData from './app/dashboards/understand.tsx';
import DataSourcePage from './app/home/data-sources/data-source-page.tsx';
import { Toaster } from "@/components/ui/toaster"
import DataEngineeringAgentBuild from './app/agents/data-engineer/agent/build.tsx';
import DataEngineeringAgentBuildPage from './app/agents/data-engineer/agent/build-page.tsx';
import BuildDataPipeline from './app/agents/data-engineer/agent/data-pipeline-builder.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* LandingPage at / */}
      <Route element={<ProtectedRoute />}> 
        <Route path="/app" element={<Shell />}> {/* App is protected */}
          <Route index element={<Dashboard />} />
          <Route path="home">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-sources" element={<DataSources />} />
            <Route path="data-sources/new" element={<NewDataSource />} />
            <Route path="data-sources/:id" element={<DataSourcePage />} />
            <Route path="my-dashboards" element={<MyDashboards />} />
          </Route>

          <Route path="agents">
            <Route path="explore" element={<ExploreAgents />} />
            <Route path="marketing" element={<MarketingAgent />} />
            <Route path="reporting" element={<ReportingAgent />} />
            <Route path="data-engineering">
              <Route index element={<DataEngineeringAgentBuild />} />
              <Route path="build" element={<DataEngineeringAgentBuildPage />} />
              <Route path="build/:id" element={<BuildDataPipeline />} />
            </Route>
          </Route>
          <Route path="dashboards">
            <Route path="sales-marketing" element={<MarketingDashboards />} />
            <Route path="build" element={<DashboardBuilder />} />
            <Route path=":id" element={<PublishedDashboard />} />
            <Route path="understand" element={<UnderstandData />} />
          </Route>
          <Route path="views">
            <Route path="data-engineering-pipelines" element={<DataEngineeringPipelines />} />
          </Route>
          <Route path="coder" element={<CodeEditor />} /> {/* Adjusted path */}
          <Route path="*" element={<ErrorPage />} />
        </Route> 
      </Route>
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<ErrorPage />} />
      <Route
        path="/auth/callback/"
        element={<AuthCallback />} 
      />
      <Route path="kanskjdnkajsndkjn" element={<App />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
  ,
)
