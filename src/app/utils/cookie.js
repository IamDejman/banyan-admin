import Cookie from "js-cookie";

const dev = process.env.NODE_ENV === "development";
const parentDomain = dev ? undefined : "banyan-admin-six.vercel.app";

const cookie = () => {
  /**
   * use to set cookie
   * @param {*} key
   * @param {*} value
   */
  const setCookie = (key, value) => {
    const options = {
      path: "/",
      expires: 2,
      secure: !dev,
      sameSite: 'strict'
    };
    
    // Only set domain if it's defined (for production)
    if (parentDomain) {
      options.domain = parentDomain;
    }
    
    return Cookie.set(key, value, options);
  };

  /**
   * use to get cookie
   * @param {*} key
   */
  const getCookie = (key) => {
    return Cookie.get(key);
  };

  /**
   * use to delete cookie
   * @param {*} key
   */
  const deleteCookie = (key) => {
    const options = {
      path: "/",
      secure: !dev,
      sameSite: 'strict'
    };
    
    // Only set domain if it's defined (for production)
    if (parentDomain) {
      options.domain = parentDomain;
    }
    
    return Cookie.remove(key, options);
  };

  return { setCookie, getCookie, deleteCookie };
};

export default cookie;


