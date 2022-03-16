import React, { useEffect, useState } from "react";
import { CWidgetDropdown, CRow, CCol, CSpinner } from "@coreui/react";
import firebase from "../../config/fbconfig";

const WidgetsDropdown = () => {
  const [orders, setOrders] = useState("");
  const [users, setUsers] = useState("");
  const [services, setServices] = useState("");
  const [providers, setProviders] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      // .onSnapshot((snapshot) => {
      //   setUsers(snapshot.docs.length.toString());
      //   setLoading(false);
      // });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("orders")
      // .onSnapshot((snapshot) => {
      //   setOrders(snapshot.docs.length.toString());
      // });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("providers")
      // .onSnapshot((snapshot) => {
      //   setProviders(snapshot.docs.length.toString());
      // });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("services")
      // .onSnapshot((snapshot) => {
      //   setServices(snapshot.docs.length.toString());
      // });
    return () => unsubscribe();
  }, []);

  // render
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-primary"
          text={users}
          header="Users"
          style={{
            height: 165,
          }}
          footerSlot={
            loading && (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: 100,
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <CSpinner color="primary" />
              </div>
            )
          }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-info"
          text={orders.toString()}
          header="Orders"
          style={{
            height: 165,
          }}
          footerSlot={
            loading && (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: 100,
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <CSpinner color="primary" />
              </div>
            )
          }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-warning"
          text={services.toString()}
          header="Services"
          style={{
            height: 165,
          }}
          footerSlot={
            loading && (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: 100,
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <CSpinner color="primary" />
              </div>
            )
          }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-danger"
          text={providers.toString()}
          header="Providers"
          style={{
            height: 165,
          }}
          footerSlot={
            loading && (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: 100,
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <CSpinner color="primary" />
              </div>
            )
          }
        ></CWidgetDropdown>
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
