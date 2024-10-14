import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
// import { Navbar, Nav, Container, Alert, Button } from "react-bootstrap";
import { AppLayout,Alert,Notifications, Header, Link, BreadcrumbGroup, TopNavigation, Container, Button} from "@cloudscape-design/components"
import Home from "./routes/Home";
import Search from "./routes/Search";
import Dashboard from "./routes/Dashboard/index";
import { useState } from "react";
import { payloadFromToken, logOut } from "./api/auth";
import { useTranslation } from 'react-i18next';
import "./locales/i18n";

const routes = [
  {
    path: "/search",
    name: "Search",
    Component: Search,
    Breadcrumb: () => {
      return <BreadcrumbGroup
        items={[
          { text: "Home", href: "../" },
          { text: "Search", href: "search" }
        ]}
        ariaLabel="Breadcrumbs"
      />
    }
  },
  {
    path: "/dashboard/parsedFiles/search",
    name: "Search",
    Component: Search,
    Breadcrumb: () => {
      return <BreadcrumbGroup
        items={[
          { text: "Home", href: "../" },
          { text: "Search", href: "search" }
        ]}
        ariaLabel="Breadcrumbs"
      />
    }
  },
  {
    path: "/dashboard/:key*",
    name: "Call Details",
    hide: true,
    Component: Dashboard,
    Breadcrumb: () => {
      const { t } = useTranslation();
      return <BreadcrumbGroup
        items={[
          { text: t('home.title'), href: "../../" },
          { text: t('callList'), href: "../../" },
          { text: t('callDetail'), href: "#" },
        ]}
        ariaLabel="Breadcrumbs"
      />
    }
  },
  {
    path: "/",
    name: "Call List",
    Component: Home,
    Breadcrumb: () => {
      const { t } = useTranslation();
      return <BreadcrumbGroup
        items={[
          { text: t("home.title"), href: "#" },
          { text: t("callList"), href: "#" },
        ]}
        ariaLabel="Breadcrumbs"
      />
    }
  },
];

function Navigation({ userName, email }) {
  const { t } = useTranslation();

  return (
      <TopNavigation
        identity={{
          href: "/",
          title: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ height: '20px', marginRight: '10px' }} 
              />
              {t('headerTitle')}
            </div>
          ),
          iconName: "settings"
        }}
        i18nStrings={{
          searchIconAriaLabel: t('searchIconAriaLabel'),
          searchDismissIconAriaLabel: t('searchDismissIconAriaLabel'),
          overflowMenuTriggerText: t('overflowMenuTriggerText'),
          overflowMenuTitleText: t('overflowMenuTitleText'),
          overflowMenuBackIconAriaLabel: t('overflowMenuBackIconAriaLabel'),
          overflowMenuDismissIconAriaLabel: t('overflowMenuDismissIconAriaLabel')
        }}
        utilities={[
          {
            type: "button",
            text: t('utilities.search'),
            iconName: "search",
            href: "search",
            externalIconAriaLabel: " (opens in a new tab)"
          },
          {
            type: "button",
            text: t('utilities.blogPost'),
            href: "https://amazon.com/post-call-analytics",
            external: true,
            externalIconAriaLabel: " (opens in a new tab)"
          },
          {
            type: "menu-dropdown",
            text: userName,
            description: email,
            iconName: "user-profile",
            onItemClick: (event) => {
              console.log(event);
              if (event.detail.id === "signout") logOut();
            },
            items: [
              /* { id: "profile", text: "Profile" },
              { id: "preferences", text: "Preferences" },
              { id: "security", text: "Security" },*/
              {
                id: "support-group",
                text: t('utilities.support'),
                items: [
                  {
                    id: "documentation",
                    text: t('utilities.documentation'),
                    href: "https://github.com/aws-samples/amazon-transcribe-post-call-analytics/",
                    external: true,
                    externalIconAriaLabel: 
                      " (opens in new tab)"
                  },
                  {
                    id: "feedback",
                    text: t('utilities.feedback'),
                    href: "https://amazon.com/post-call-analytics",
                    external: true,
                    externalIconAriaLabel: 
                      " (opens in new tab)"
                  }
                ]
              },
              { id: "signout", text: t('utilities.signout') }
            ]
          }
          
        ]}
      />
  );
}

function App() {
  const [alert, setAlert] = useState();

  const onDismiss = () => {
    setAlert(null);
  };

  const userToken = localStorage.getItem("id_token");
  const parsedToken = payloadFromToken(userToken);
  const cognitoUserName = parsedToken["cognito:username"] || "Unknown";
  const cognitoEmail = parsedToken["email"] || "Unknown";

  return (
    <Router>
      <Switch>
        {routes.map(({ path, Component, Breadcrumb, name }) => (
          <Route key={path} path={path}>
            <Navigation userName={cognitoUserName} email={cognitoEmail} />
            <AppLayout
              stickyNotifications
              toolsHide
              navigationHide
              breadcrumbs={
                <Breadcrumb/>
              }
              notifications={alert && (
                <Alert
                  variant={alert.variant}
                  dismissible
                  header={alert.heading}
                  onDismiss={onDismiss}
                >
                  {alert.text}
                </Alert>
              )}
              content={
                <Component setAlert={setAlert} />
              }
            />
          </Route>
        ))}
      </Switch>
    </Router>
  );
}

export default App;
