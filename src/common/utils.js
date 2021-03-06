export const apiWrapper = async (
  serviceCall,
  req,
  onSuccess,
  onError,
  onUnauthorized
) => {
  try {
    //lg:mx-40 xl:mx-72 lg:px-4 xl:px-4 md:px-4
    console.log(req);
    const res = await serviceCall(req);
    console.log(res);

    if (res.status === 204) {
      return onSuccess({});
    }
    //console.log(res);
    const json = await res.json();

    if (res.ok) {
      return onSuccess(json);
    }

    if (res.status === 401) {
      onError("Your session has expired. Please login.");
      return onUnauthorized();
    }
    console.log("json *******");
    console.log(json);
    return onError(json.description ? json.description : String(json));
  } catch (e) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      return onError("Quiz Me is down. Try again is a bit");
    }
    throw e;
  }
};

export const saveUserData = (data) => {
  localStorage.setItem(
    "quiz_me",
    JSON.stringify({
      token: data.token,
      email: data.email,
      id: data.id,
    })
  );
};

export const clearUserData = () => {
  localStorage.setItem("quiz_me", "");
};

export const readUserData = () => {
  let data = localStorage.getItem("quiz_me");
  if (typeof data !== "undefined" && data !== null && data !== "") {
    console.log(data);
    data = JSON.parse(data);
    if (data.token === undefined || data.token === null) {
      console.log("there is nothing saved in local storage");
    } else {
      return data;
    }
  }

  return null;
};

export const loaderWrapper = async (openLoader, func, closeLoader) => {
  await openLoader();
  await timeout(500);
  await func();
  await closeLoader();
};

export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
