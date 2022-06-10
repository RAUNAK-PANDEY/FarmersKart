import React from "react";
import MidFolowOrders from "./views/midFlowOrders/midFlowOrders";
import CancelledOrders from "./views/cancelledOrders/CancelledOrders";

import { CreateOrder } from "./views/orders/createOrder";
import UpdateProvider from "./views/service_providers/updateProvider";
import CreateNewUser from "./views/users/createNewUser";
import EditOrder from "./views/orders/editOrder";
import TeleCallers from "./views/telecallers/teleCallers";
import { DuplicateOrder } from "./views/orders/duplicateOrder";
import { ProviderSupervisor } from "./views/orders/providerSupervisor";
import EditReferralCode from "./views/orders/AddReferralCode";
import Reviews from "./views/reviews/Reviews";
import Payments from "./views/payments/Payments";
import EditPayment from "./views/payments/EditPayment";
import Activity from "./views/activity/Activity";
import CreateLogins from "./views/create_logins/CreateLogins";
import LoginsList from "./views/logins_list/LoginsList";
import AddCity from "./views/add_city/AddCity";
import ServicesCity from "./views/services_city/ServicesCity";
import NewReferrals from "./views/referralCodes/NewReferrals";
import VerifiedServiceProviders from "./views/service_providers/VerifiedServiceProviders";
import UnVerifiedServiceProviders from "./views/service_providers/UnVerifiedServiceProviders";
import EditSubService from "./views/services/EditSubService";
import EditService from "./views/services/EditService";
import EditServiceContent from "./views/services/EditServiceContent";
import BlogsPage from "./views/blogs/BlogsPage";
import GenerateEmployeesLink from "./views/generate_employees_link/GenerateEmployeesLink";
import CreateVideo from "./views/videos/CreateVideo";
import Editcategory from "./views/videos/Editcategory";
import Subcategory from "./views/videos/Subcategory";
import AddSubcat from "./views/videos/AddSubcat";
import EditSubcat from "./views/videos/EditSubcat";
import Unit from "./views/videos/Unit";
import AddUnit from "./views/videos/AddUnit";
import EditUnit from "./views/videos/EditUnit";
import Gst from "./views/videos/Gst";
import AddGst from "./views/videos/AddGst";
import ReviewCall from "./views/reviews/ReviewCall";
import HSN from "./views/videos/HSN";
import AddHsn from "./views/videos/AddHsn";
import Brand from "./views/videos/Brand";
import AddBrand from "./views/videos/AddBrand";
import AddEmployee from "./views/blogs/AddEmployee";
import EditEmployee from "./views/blogs/EditEmployee";
import UserOrderHist from "./views/blogs/UserOrderHist";
import ShopOrder from "./views/users/Shoporder";
import HotelOrder from "./views/users/HotelOrder";
import AddCoupon from "./views/coupon/AddCoupon";
import AddBanner from "./views/banner/AddBanner";
import Banner from "./views/banner/Banner";
import Advertisement from "./views/banner/Advertisement";
import AddAdvertisement from "./views/banner/AddAdvertisement";
import EditBanner from "./views/banner/EditBanner";
import EditAdvertisement from "./views/banner/EditAdvertisement";
import Coupon from "./views/coupon/Coupon";
import EditUser from "./views/blogs/EditUser";
import HandyOrder from "./views/users/HandyOrder";
import History from "./views/blogs/History";
import Marketing from "./views/banner/Marketing1";
import UserWalletHist from "./views/wallet/UserWalletHist";
import UserWallet from "./views/wallet/UserWallet";
import CreditPoints from "./views/wallet/CreditPoints";
import UserComplaint from "./views/blogs/UserComplaint";
import Popup from "./views/banner/Popup";
import AddPopups from "./views/banner/AddPopups";
import EditPopup from "./views/banner/EditPopup";
import CancelOrder from "./views/users/CancelledOrder";
import AddCenter from "./views/delivery/AddCenter";
import Center from "./views/delivery/Center";
import Shop from "./views/delivery/shop";
import AddShop from "./views/delivery/AddShop";
import Hotel from "./views/delivery/Hotel";
import AddHotel from "./views/delivery/AddHotel";
import Contact from "./views/blogs/Contact";
import EditCenter from "./views/delivery/EditCenter";
import EditShop from "./views/delivery/EditShop";
import EditHotel from "./views/delivery/EditHotel";
import Instagram from "./views/banner/Instagram";
import AddInstagram from "./views/banner/AddInstagram";
import EditInstagram from "./views/banner/EditInstagram";
import Packed from "./views/videos/Packed";
import AddPack from "./views/videos/AddPack";

import StockReport from "./views/users/StockReport";
import SocReport from "./views/report/SocReport";
import ShopReport from "./views/report/ShopReport";
import HotelReport from "./views/report/HotelReport";

import Inventory from "./views/service_providers/Inventory";
import EachHandyOrder from "./views/users/EachHandyOrder";
import AdminOrder from "./views/users/AdminOrder";
import PaymentReport from "./views/users/PaymentReport";
import Dash from "./views/dashboard/Dash";
import EmployeeHist from "./views/blogs/EmployeeHist";
import AddComplaint from "./views/blogs/AddComplaint";
import ViewInventory from "./views/service_providers/ViewInventory";
import Comp from "./views/report/Comp";
// import Active from "./views/report/Active";
import ViewBannerHist from "./views/banner/ViewBannerHist";
import ViewInstaHist from "./views/banner/ViewInstaHist";
import ViewAdHist from "./views/banner/ViewAdHist";
import ActiveUsers from "./views/blogs/ActiveUsers";
import NonActiveUsers from "./views/blogs/NonActiveUsers";
import EditCoupon from "./views/coupon/EditCoupon";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const Users = React.lazy(() => import("./views/users/Users"));
const User = React.lazy(() => import("./views/users/User"));
const ServiceProviders = React.lazy(() =>
  import("./views/service_providers/ServiceProviders")
);
const Services = React.lazy(() => import("./views/services/Services"));
const ServiceProvider = React.lazy(() =>
  import("./views/service_providers/ServiceProvider")
);
const Orders = React.lazy(() => import("./views/orders/Orders"));
const LinkOrders = React.lazy(() => import("./views/link_orders/linkOrders"));

const Order = React.lazy(() => import("./views/orders/Order"));
const ReferralCodes = React.lazy(() =>
  import("./views/referralCodes/ReferralCodes")
);
const EmployeeLinks = React.lazy(() =>
  import("./views/generate_employees_link/EmployeeLinks")
);

const Videos = React.lazy(() => import("./views/videos/Videos"));
const Report = React.lazy(() => import("./views/report/SocReport"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", exact: true, name: "Dashboard", component: Dash},
  // { path: "/dashboard", exact: true, name: "Dashboard", component: Services },
  { path: "/users", exact: true, name: "Society Order Management", component: Users },
  { path: "/users/shop-order", exact: true, name: "Shop Order Management", component:ShopOrder},
  { path: "/users/hotel-order", exact: true, name: "Hotel Order Management", component:HotelOrder},
  { path: "/users/handy-order", exact: true, name: "Handy Order Management", component:HandyOrder},
  { path: "/users/admin-order", exact: true, name: "Admin Order", component:AdminOrder},
  { path: "/users/cancelled-order", exact: true, name: "Cancelled Order", component:CancelOrder},
  { path: "/users/stock-report", exact: true, name: "Tomorrow Stock Report", component:StockReport},
  { path: "/payment-report", exact: true, name: "Payment Report", component:PaymentReport},

  {
    path: "/users/create-user",
    exact: true,
    name: "Create User",
    component: CreateNewUser,
  },
  {
    path: "/users/update-user/:id",
    exact: true,
    name: "Update User",
    component: CreateNewUser,
  },
  { path: "/users/:id", exact: true, name: "User Details", component: User },
  {
    path: "/users/:userId/create_order",
    exact: true,
    name: "Create Orders",
    component: CreateOrder,
  },
  {
    path: "/users/handy-order/:id",
    exact: true,
    name: "Process handy order",
    component: EachHandyOrder,
  },
  {
    path: "/service_providers",
    exact: true,
    name: "Service Providers",
    component: ServiceProviders,
  },
  {
    path: "/service_providers/update/:id",
    exact: true,
    name: "Update Service Provider",
    component: UpdateProvider,
  },
  {
    path: "/verified_service_providers",
    exact: true,
    name: "Verified Service Providers",
    component: VerifiedServiceProviders,
  },
  {
    path: "/unverified_service_providers",
    exact: true,
    name: "UnVerified Service Providers",
    component: UnVerifiedServiceProviders,
  },
  {
    path: "/service_providers/:id",
    exact: true,
    name: "",
    component: ServiceProvider,
  },
  { path: "/services", exact: true, name: "Services", component: Services },
  {
    path: "/services/:sid",
    exact: true,
    name: "Edit Service",
    component: EditService,
  },

  {
    path: "/edit_service",
    exact: true,
    name: "Edit Service",
    component: EditServiceContent,
  },
  {
    path: "/editcoupon",
    exact: true,
    name: "Edit Coupon",
    component: EditCoupon,
  },
  {
    path: "/inventory",
    exact: true,
    name: "Inventory",
    component: Inventory,
  },
  {
    path: "/view-inventory",
    exact: true,
    name: "View Inventory",
    component: ViewInventory,
  },
  {
    path: "/services/:sid/:ssid",
    exact: true,
    name: "Edit Sub Services",
    component: EditSubService,
  },
  {
    path: "/links",
    exact: true,
    name: "Employee Links",
    component: EmployeeLinks,
  },
  {
    path: "/links/generate-link",
    exact: true,
    name: "Generate Link",
    component: GenerateEmployeesLink,
  },
  {
    path: "/delivery/center",
    exact: true,
    name: "View center",
    component: Center,
  },
  {
    path: "/delivery/add-center",
    exact: true,
    name: "Add center",
    component: AddCenter,
  },
  {
    path: "/delivery/edit-center",
    exact: true,
    name: "Edit center",
    component: EditCenter,
  },
  {
    path: "/delivery/shop",
    exact: true,
    name: "View Shop",
    component: Shop,
  },
  {
    path: "/delivery/add-shop",
    exact: true,
    name: "Add Shop",
    component: AddShop,
  },
  {
    path: "/delivery/edit-shop",
    exact: true,
    name: "Edit Shop",
    component: EditShop,
  },
  {
    path: "/delivery/hotel",
    exact: true,
    name: "View hotel",
    component: Hotel,
  },
  {
    path: "/delivery/add-hotel",
    exact: true,
    name: "Add Hotel",
    component: AddHotel,
  },
  {
    path: "/delivery/edit-hotel",
    exact: true,
    name: "Edit Hotel",
    component: EditHotel,
  },

  {
    path: "/coupon",
    exact: true,
    name: "View Coupons",
    component: Coupon,
  },
  {
    path: "/coupon/add-coupon",
    exact: true,
    name: "Add Coupons",
    component: AddCoupon,
  },
  {
    path: "/marketing",
    exact: true,
    name: "Marketing And Promotions",
    component: Marketing,
  },
  {
    path: "/banner",
    exact: true,
    name: "Banners",
    component: Banner,
  },
  {
    path: "/banner/add-banner",
    exact: true,
    name: "Add Banners",
    component: AddBanner,
  },
  {
    path: "/banner/edit-banner",
    exact: true,
    name: "Edit Banners",
    component: EditBanner,
  },
  {
    path: "/banner/banner-hist",
    exact: true,
    name: "Banners History",
    component: ViewBannerHist,
  },
  {
    path: "/instagram",
    exact: true,
    name: "Instagram",
    component: Instagram,
  },
  {
    path: "/banner/add-instagram",
    exact: true,
    name: "Add Instagram",
    component: AddInstagram,
  },
  {
    path: "/banner/instagram-hist",
    exact: true,
    name: "Instagram History",
    component: ViewInstaHist,
  },
  {
    path: "/banner/edit-instagram",
    exact: true,
    name: "Edit Instagram",
    component: EditInstagram,
  },
  {
    path: "/banner/advertisement",
    exact: true,
    name: "Advertisement",
    component: Advertisement,
  },
  {
    path: "/banner/add-advertisement",
    exact: true,
    name: "Add Advertisement",
    component: AddAdvertisement,
  },
  {
    path: "/banner/ad-hist",
    exact: true,
    name: "Advertisement History",
    component: ViewAdHist,
  },
  {
    path: "/banner/edit-advertisement",
    exact: true,
    name: "Edit Advertisement",
    component: EditAdvertisement,
  },
  {
    path: "/banner/popups",
    exact: true,
    name: "Popups",
    component: Popup,
  },
  {
    path: "/banner/add-popups",
    exact: true,
    name: "Add Popups",
    component: AddPopups,
  },
  {
    path: "/banner/edit-popups",
    exact: true,
    name: "Edit Popups",
    component: EditPopup,
  },
  {
    path: "/videos",
    exact: true,
    name: "Youtube Videos",
    component: Videos,
  },
  {
    path: "/videos/create-video",
    exact: true,
    name: "Create Video",
    component: CreateVideo,
  },
  {
    path: "/videos/edit-category",
    exact: true,
    name: "Edit Category",
    component: Editcategory,
  },
  {
    path: "/videos/sub-category",
    exact: true,
    name: "Sub Category",
    component: Subcategory,
  },
  {
    path: "/videos/add-subcategory",
    exact: true,
    name: "Add Sub Category",
    component: AddSubcat,
  },
  {
    path: "/videos/edit-subcategory",
    exact: true,
    name: "Edit Sub Category",
    component: EditSubcat,
  },
  {
    path: "/videos/unit",
    exact: true,
    name: "Unit",
    component: Unit,
  },
  {
    path: "/videos/add-unit",
    exact: true,
    name: "Add Unit",
    component: AddUnit,
  },
  {
    path: "/videos/edit-unit",
    exact: true,
    name: "Edit Unit",
    component: EditUnit,
  },
  {
    path: "/videos/gst",
    exact: true,
    name: "GST",
    component: Gst,
  },{
    path: "/videos/add-gst",
    exact: true,
    name: "Add GST",
    component: AddGst,
  },
  {
    path: "/videos/hsn",
    exact: true,
    name: "HSN",
    component: HSN,
  },
  {
    path: "/videos/add-hsn",
    exact: true,
    name: "Add HSN",
    component: AddHsn,
  },
  {
    path: "/videos/brand",
    exact: true,
    name: "Brand",
    component: Brand,
  },
  {
    path: "/videos/add-brand",
    exact: true,
    name: "Add Brand",
    component: AddBrand,
  },
  {
    path: "/videos/packer",
    exact: true,
    name: "Packager List",
    component: Packed,
  },{
    path: "/videos/add-packer",
    exact: true,
    name: "Add Packager",
    component: AddPack,
  },
  {
    path: "/wallet",
    exact: true,
    name: "User Wallet History",
    component: UserWallet,
  },
  {
    path: "/wallet/user-history",
    exact: true,
    name: "User Wallet",
    component: UserWalletHist,
  },
  {
    path: "/wallet/add-points",
    exact: true,
    name: "Add Points",
    component: CreditPoints,
  },
  // {
  //   path: "/videos/hsn",
  //   exact: true,
  //   name: "HSN",
  //   component: HSN,
  // },
  // {
  //   path: "/videos/edit-unit",
  //   exact: true,
  //   name: "Edit Unit",
  //   component: EditUnit,
  // },
  { path: "/orders", exact: true, name: "Orders", component: Orders },
  {
    path: "/link-orders",
    exact: true,
    name: "Link Orders",
    component: LinkOrders,
  },
  {
    path: "/orders/create_order",
    exact: true,
    name: "Create Orders",
    component: CreateOrder,
  },
  {
    path: "/orders/requestedOrders",
    exact: true,
    name: "Requested Order",
    component: MidFolowOrders,
  },
  {
    path: "/orders/cancelledOrders",
    exact: true,
    name: "Cancelled Order",
    component: CancelledOrders,
  },
  {
    path: "/orders/editOrder/:id",
    exact: true,
    name: "Edit Order",
    component: EditOrder,
  },
  {
    path: "/orders/duplicateOrder/:id",
    exact: true,
    name: "Duplicate Order",
    component: DuplicateOrder,
  },
  {
    path: "/orders/supervisor/:id",
    exact: true,
    name: "Supervise Order",
    component: ProviderSupervisor,
  },
  {
    path: "/editReferral/:id",
    exact: true,
    name: "Edit Referral",
    component: EditReferralCode,
  },
  { path: "/orders/:id", exact: true, name: "", component: Order },
  {
    path: "/referralCodes",
    exact: true,
    name: "Referral Codes",
    component: ReferralCodes,
  },

  {
    path: "/referralCodes/new_referrals",
    exact: true,
    name: "New Referrals",
    component: NewReferrals,
  },

  {
    path: "/employees",
    exact: true,
    name: "Employees",
    component: TeleCallers,
  },
  { path: "/reviews", exact: true, name: "Employee Reviews", component: Reviews },
  { path: "/reviewcall", exact: true, name: "Review Call", component: ReviewCall },
  { path: "/payments", exact: true, name: "Payments", component: Payments },
  {
    path: "/payments/edit/:id",
    exact: true,
    name: "Edit Payment",
    component: EditPayment,
  },
  { path: "/activity", exact: true, name: "Activity", component: Activity },
  {
    path: "/create_logins",
    exact: true,
    name: "Create Logins",
    component: CreateLogins,
  },
  {
    path: "/logins_list",
    exact: true,
    name: "Logins List",
    component: LoginsList,
  },
  { path: "/add_city", exact: true, name: "Add City", component: AddCity },
  {
    path: "/services_city",
    exact: true,
    name: "Services City",
    component: ServicesCity,
  },
  {
    path: "/blogs",
    exact: true,
    name: "Employee List",
    component: BlogsPage,
  },
  {
    path: "/blogs/add-employee",
    exact: true,
    name: "Add Employee",
    component: AddEmployee,
  },
  {
    path: "/blogs/edit-employee",
    exact: true,
    name: "Edit Employee",
    component: EditEmployee,
  },
  {
    path: "/blogs/view-employee-history",
    exact: true,
    name: "View Employee History",
    component: EmployeeHist,
  },

  {
    path: "/blogs/user-Orderhistory",
    exact: true,
    name: "User Order History",
    component: UserOrderHist,
  },
  {
    path: "/blogs/user-history",
    exact: true,
    name: "User Order History",
    component: History,
  },
  {
    path: "/blogs/non-active-users",
    exact: true,
    name: "Non Active Users",
    component: NonActiveUsers,
  },
  {
    path: "/blogs/active-user",
    exact: true,
    name: "Active Users",
    component: ActiveUsers,
  },
  
  {
    path: "/blogs/user-complaint",
    exact: true,
    name: "User Complaint",
    component: UserComplaint,
  },
  {
    path: "/blogs/add-user-complaint",
    exact: true,
    name: "Add User Complaint",
    component: AddComplaint,
  },
  {
    path: "/contact-us",
    exact: true,
    name: "Contact Us",
    component: Contact,
  },
  {
    path: "/blogs/edit-user",
    exact: true,
    name: "Edit User",
    component: EditUser,
  },
  {
    path: "/report/society-report",
    exact: true,
    name: "Society Report",
    component: SocReport,
  },
  {
    path: "/report/shop-report",
    exact: true,
    name: "Societywise Report",
    component: ShopReport,
  },
  {
    path: "/report/hotel-report",
    exact: true,
    name: "Category Report",
    component: HotelReport,
  },
  {
    path: "/report/Comparison-report",
    exact: true,
    name: "Sale Growth Report",
    component: Comp,
  },
  // {
  //   path: "/report/Customer-report",
  //   exact: true,
  //   name: "Active Inactive Customer Report",
  //   component: Active,
  // },
];

export default routes;
