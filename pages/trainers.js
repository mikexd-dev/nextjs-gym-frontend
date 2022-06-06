import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import Drawer from "../components/Drawer";
import Progress from "../components/Progress";

const Home = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setLoading(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      // setLoading(false);
    };
  }, []);

  return (
    <div>
      <Progress open={loading} />
      {user?.email && (
        <Drawer>
          <div>
            trainers
            <div>Email: {user.email}</div>
            <button onClick={() => logout()}>Logout</button>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Home);
