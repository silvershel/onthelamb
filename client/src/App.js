import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// components
import TopNav from './components/TopNav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EventDetails from './components/EventDetails';
import EventList from './components/EventList';
import UserDashboard from './components/UserDashboard';
import ErrorPage from './components/ErrorPage';
import Footer from './components/Footer';

// context
import { AppProvider, useAppContext } from './contexts/AppContext';

function Routes() {
	const { currentUser } = useAppContext();
  
	if (!currentUser) {
		return (
			<div className='login'>
				<Switch>
					<Route path='/login' exact component={LoginForm} />
					<Route path='/signup' exact component={SignupForm}/>
					<Route path='/' exact>
						<Redirect to='/login' />
					</Route>
					<Route path='*' exact component={ErrorPage} />
				</Switch>	
			</div>				
	  	);
	} 

	return (
		<div id='app-container' className='body'>
			<div>
				<TopNav />
			</div>
			<div>
				<Switch>
					<Route path='/login' exact>
						<Redirect to='/' />
					</Route>
					<Route path='/signup' exact>
						<Redirect to='/' />
					</Route>
					<Route path='/' exact component={UserDashboard} />
					<Route path='/dashboard' exact component={UserDashboard}/>
					<Route path='/events' exact component={EventList} />
					<Route path='/events/:eventId' exact component={EventDetails} />
					<Route path='*' component={ErrorPage} />
				</Switch>
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
  }
  
  function App() {
	return (
		<AppProvider>
			<Router>
				<Routes />
			</Router>
		</AppProvider>
	);
  }
  
  export default App;