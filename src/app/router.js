// import external modules
import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Spinner from "../components/spinner/spinner";

import { getCurrentUser } from '../utility/APIutils';

// import internal(own) modules
import MainLayoutRoutes from "../layouts/routes/mainRoutes";
import FullPageLayout from "../layouts/routes/fullpageRoutes";
import ErrorLayoutRoute from "../layouts/routes/errorRoutes";

// Full Layout
const LazyForgotPassword = lazy(() => import("../views/pages/forgotPassword"));
const LazyLogin = lazy(() => import("../views/pages/login"));
const LazyRegister = lazy(() => import("../views/pages/register"));
const LazyMaintainance = lazy(() => import("../views/pages/maintainance"));
const LazyLockScreen = lazy(() => import("../views/pages/lockScreen"));
const LazyUserProfile = lazy(() => import("../views/pages/userProfile"));

// Error Pages
const LazyErrorPage = lazy(() => import("../views/pages/error"));

class Router extends Component {

   constructor(props) {
      super(props);
      this.state = {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false
      }
      // this.handleLogout = this.handleLogout.bind(this);
      this.loadCurrentUser = this.loadCurrentUser.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.loadCurrentUser();
    }

   loadCurrentUser() {
      this.setState({
        isLoading: true
      });
      getCurrentUser()
      .then(response => {
         console.log("currentUser : ", response)
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });  
      });
    }


    handleLogin() {
      this.loadCurrentUser();
    }
  

   render() {
         if(this.state.isLoading) {
           return (<div></div>);
         }
      return (
         // Set the directory path if you are deplying in sub-folder
         <BrowserRouter basename="/">
            <Switch>

               {/* Saperate Pages Views */}
               <FullPageLayout
                  exact
                  path="/pages/forgot-password"
                  render={matchprops => (
                     <Suspense fallback={<Spinner />}>
                        <LazyForgotPassword {...matchprops} />
                     </Suspense>
                  )}
               />
               <FullPageLayout
                  exact
                  path="/pages/login"
                  render={matchprops => (
                     <Suspense fallback={<Spinner />}>
                        <LazyLogin onLogin={this.handleLogin} {...matchprops} />
                     </Suspense>
                  )}
               />
               <FullPageLayout
                  exact
                  path="/pages/register"
                  render={matchprops => (
                     <Suspense fallback={<Spinner />}>
                        <LazyRegister {...matchprops} />
                     </Suspense>
                  )}
               />
               <MainLayoutRoutes
                  exact
                  path="/pages/user-profile"
                  currentUser={this.state.currentUser}
                  render={matchprops => (
                     <Suspense fallback={<Spinner />}>
                        <LazyUserProfile {...matchprops} />
                     </Suspense>
                  )}
               />

            </Switch>
         </BrowserRouter>
      );
   }
}

export default Router;