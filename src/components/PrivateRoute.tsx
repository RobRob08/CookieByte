// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IonLoading } from '@ionic/react';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  component: Component, 
  adminOnly = false,
  ...rest 
}) => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return <IonLoading isOpen={true} message="Loading..." />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/login" />;
        }

        if (adminOnly && !isAdmin) {
          return <Redirect to="/main" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;