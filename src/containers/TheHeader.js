import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import React from "react";



import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CImg,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import firebase from "../config/fbconfig";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";

// window.vname = 0;
//   [window.setVideo] = [];
//   export function image64ad (image64) {
//     const videos = await firebase.firestore().collection("orders").where("orderStatus", "==", "placed").get();
//     // console.log(videos.docs.length);
//     // setToday(videos.docs.length)
//       window.setVideo=image64;
//       window.vname=videos.docs.length;
//   }

const TheHeader = () => {
  // const loggedIn = useSelector(state => state.loggedIn)
  const [today, setToday] = useState("");
  const [complaint, setComplaint] = useState("");
  const [contact, setContact] = useState("");
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    const doToggle = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "toggleSidebar", sidebarShow: doToggle });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "toggleSidebar", sidebarShow: val });
  };
  useEffect(() => {
    getVideos();
    // getPackage();
  }, []);
  const getVideos = async () => {
    const videos = await firebase.firestore().collection("orders").where("orderStatus", "==", "placed").onSnapshot(querySnapshot => {
      // console.log(`Received query snapshot of size ${querySnapshot.size}`);
      setToday(querySnapshot.size)
      // ...
    }, err => {
      // console.log(`Encountered error: ${err}`);
    });
    const cmp = await firebase.firestore().collection("complaints").where("isActive", "==", true).onSnapshot(querySnapshot => {
      // console.log(`Received query snapshot of size ${querySnapshot.size}`);
      setComplaint(querySnapshot.size)
      // ...
    }, err => {
      // console.log(`Encountered error: ${err}`);
    });

    // const users = await firebase
    //   .firestore()
    //   .collection("complaints")
    //    .get();
    //   setComplaint(users.docs.length);
    // const con = await firebase.firestore().collection("queries").where("status", "==", "New").onSnapshot(querySnapshot => {
    //   // console.log(`Received query snapshot of size ${querySnapshot.size}`);
    //   setContact(querySnapshot.size)
    //   // ...
    // }, err => {
    //   // console.log(`Encountered error: ${err}`);
    // });
  };
  // console.log(complaint)
  return (
    <CHeader
      withSubheader
      style={{
        zIndex: 1030,
      }}
    >
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        {/* <CIcon name="logo" height="48" alt="Logo" /> */}

        <CImg src={"avatars/logo.png"} height={100} alt="company-logo" />
        {/* {!loggedIn ? <CButton color="primary" className="px-4" onClick={handleLoginClick}>Login</CButton> : <></>} */}
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {/* <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem> */}
        <CHeaderNavItem className="px-3">
        <CBadge shape="pill" color="danger" position='bottom-start'>{today}</CBadge>
          <CHeaderNavLink to="/users">Society Order Management</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/service_providers">Add Product</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
        <CBadge shape="pill" color="danger" position='bottom-start'>{complaint}</CBadge>
          <CHeaderNavLink to="/blogs/user-complaint">User Complaint</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
        <CBadge shape="pill" color="danger" position='bottom-start'>{contact}</CBadge>
          <CHeaderNavLink to="/contact-us">Contact Us</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/payment-report">Payment Report</CHeaderNavLink>
        </CHeaderNavItem>
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/telecallers">Telecallers</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/reviews">Reviews</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/payments">Payments</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/activity">Activity</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/blogs">Blogs</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          {!loggedIn ? <CButton color="primary" className="px-4" onClick={handleLoginClick}>Login</CButton> : <></>}
        </CHeaderNavItem> */}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {/* <TheHeaderDropdownNotif />
        <TheHeaderDropdownTasks />
        <TheHeaderDropdownMssg /> */}
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink>
          <CLink
            className="c-subheader-nav-link"
            aria-current="page"
            to="/dashboard"
          >
            <CIcon name="cil-graph" alt="Dashboard" />
            &nbsp;Dashboard
          </CLink>
          <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-settings" alt="Settings" />
            &nbsp;Settings
          </CLink>
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
