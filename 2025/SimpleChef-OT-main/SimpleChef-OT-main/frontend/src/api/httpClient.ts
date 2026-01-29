const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"; // Api kutsujen perusosoite. Haetaan env tiedostosta osoite, jos on muuten url osoite on localhost 3000. Tämä rivi päättää mihin kaikki api kutsut menevät

//katsotaan onko käyttäjä kirjautunut
function GetAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken"); // luetaan selaimen sisäänrakennetusta muistista, onko käyttäjällä authToken => onko kirjautunut

  //Jos token on olemassa, palautetaan authorization header. esim. Authorization: Bearer abcdefg123456 <- ovat käytännössä nimi-arvo pareja
  if (token) {
    return { Authorization: `Bearer ${token}` }; //Bearer on standardi tapa käyttää JWT tokeneita. Backend tunnistaa Bearer = token tyyppi, arvo = merkkijono
  } else {
    return {};
  }
}

//Tehtävä on palauttaa JSON-data, jonka tyyppi on T.
//path = reitin loppuosa esim. /users tai /login.
// RequestInit tulee selaimen fetch() funktiosta automaattisesti. Sisältää objektin, jolla on esim. { method: GET/POST/PUT, headers: HTTP-headerit, body: data mitä lähetetään.}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const tokenHeaders = GetAuthHeaders();

  //Record = typescriptin versio dictionarystä C#
  let userHeaders: Record<string, string> = {};

  //varmistetaan että optionin headers on objekti ja ei ole taulukko
  if (typeof options.headers === "object" && !Array.isArray(options.headers)) {
    userHeaders = options.headers as Record<string, string>;
  }

  //Kasataan header objekti yhdistämällä kolme objektia yhdeksi
  const headers: Record<string, string> = Object.assign(
    {},
    tokenHeaders, //esim. { Authorization: "Bearer abcdefg123456"}
    userHeaders //esim. { "X-test": "AAA"}
  );

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  //Lopullisen pyynnön rakennus
  //Esim path = /users ja url tulos on localhost 3000 saadaan: http://localhost:3000/users
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options, //esim. {method: "POST", body: JSON.stringify({ name: "Matti" })}
    headers, //esim. {Authorization: "Bearer abc123", Authorization: "Bearer abc123", "X-Test": "AAA"}
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const message =
      err?.error ?? err?.message ?? `HTTP error ${response.status}`;

    throw new Error(message);
  }

  return response.json();
}

//Fetchin get pyynnöt.
//Esim käytöstä: const users = await apiGet<User[]>("/users") => haetaan kaikki käyttäjät
export async function apiGet<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

//Fetchin post pyynnöt
//Esim käytöstä: const newUser = await apiPost<{ name: string }, User>("/users", { name: "Matti" });
export async function apiPost<TBody, TResponse>(path: string, body: TBody, options: RequestInit = {}): Promise<TResponse> {
  return request<TResponse>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

//Fetchin put pyynnöt
//Esim käytöstä: const updatedUser = await apiPut<{ name: string }, User>("/users/123", { name: "Matti Updated" });
export async function apiPut<TBody, TResponse>(path: string, body: TBody, options: RequestInit = {}): Promise<TResponse> {
  return request<TResponse>(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

//Fetchin delete pyynnöt
//Esim käytöstä: await apiDelete("/users/123");
export async function apiDelete<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  return request<TResponse>(path, { ...options, method: "DELETE" });
}