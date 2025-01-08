import { KeyValue } from "@angular/common";

export enum Permissions {
  ViewProducts = 'ViewProducts',
  AddProducts = 'AddProducts',
  EditProducts = 'EditProducts',
  DeleteProducts = 'DeleteProducts',
  ViewUsers = 'ViewUsers',
  AddUsers = 'AddUsers',
  EditUsers = 'EditUsers',
  DeleteUsers = 'DeleteUsers',
  ViewDashboard = 'ViewDashboard',
  ViewLogs = 'ViewLogs',
  ClearLogs = 'ClearLogs',
  ViewSales = 'ViewSales',
}

export const RolePermissions: { [key: string]: string[] } = {
  "Admin": [
    Permissions.ViewProducts,
    Permissions.EditProducts,
    Permissions.DeleteProducts,
    Permissions.AddProducts,
    Permissions.ViewUsers,
    Permissions.EditUsers,
    Permissions.DeleteUsers,
    Permissions.AddUsers,
    Permissions.ViewLogs,
    Permissions.ClearLogs,
    Permissions.ViewDashboard,
    Permissions.ViewSales
  ],
  "Manager": [
    Permissions.ViewProducts,
    Permissions.DeleteProducts,
    Permissions.EditProducts,
    Permissions.DeleteProducts,
    Permissions.AddProducts,
    Permissions.ViewDashboard,
  ],
  "Staff": [
    Permissions.ViewProducts,
    Permissions.ViewDashboard,
  ],
};
