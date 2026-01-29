import { useNavigate } from "react-router-dom";
import { useAuth } from "../authorization/AuthContext";
import { navButton } from "../../library/componentsPresets";
export function NavBar() {
  const nav = useNavigate();
  const { token, logout } = useAuth();

  const isLoggedIn = !!token;
  return (
    <div className="flex flex-row items-center justify-between p-4 border border-x-0 border-black/20">
      <div>
        <h1
          className="text-3xl font-semibold hover:cursor-pointer text-orange-400"
          onClick={() => nav("/")}
        >
          MC Mikkeli
        </h1>
      </div>
      {!isLoggedIn ? (
        <ul className="flex flex-row">
          <li className={navButton} onClick={() => nav(`/recipes/public`)}>
            Public Recipes
          </li>
        </ul>
      ) : (
        <ul className="flex flex-row">
          <li className={navButton} onClick={() => nav(`/recipes/public`)}>
            Public Recipes
          </li>
          <li className={navButton} onClick={() => nav(`/recipes/new`)}>
            New Recipe
          </li>
          <li className={navButton} onClick={() => nav(`/recipes`)}>
            My Recipes
          </li>
          <li className={navButton} onClick={() => nav(`/favorites`)}>
            Favorites
          </li>
        </ul>
      )}

      {isLoggedIn ? (
        <ul
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          <li className={navButton}>Log Out</li>
        </ul>
      ) : (
        <ul className="flex">
          <li className={navButton} onClick={() => nav(`/login`)}>
            Log In
          </li>
          <li className={navButton} onClick={() => nav(`/register`)}>
            Register
          </li>
        </ul>
      )}
    </div>
  );
}
