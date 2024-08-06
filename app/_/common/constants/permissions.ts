import { z } from "zod";

export const PERMISSION_EMPTY = 0;
export const PERMISSION_CONTENT_READ = 1 << 0;

export const PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION = 1 << 1;

export const PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME = 1 << 2;
export const PERMISSION_TASK_BOARD_UPDATE_FLOW_DIRECTION = 1 << 3;
export const PERMISSION_TASK_BOARD_UPDATE_DEFAULT_PERMISSION = 1 << 4;
export const PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL = 1 << 5;
export const PERMISSION_TASK_BOARD_DELETE = 1 << 6;

export const PERMISSION_TASK_LIST_CREATE_DELETE = 1 << 7;
export const PERMISSION_TASK_LIST_UPDATE_TITLE = 1 << 8;
export const PERMISSION_TASK_LIST_UPDATE_SORT_BY = 1 << 9;
export const PERMISSION_TASK_LIST_REORDER = 1 << 10;

export const PERMISSION_TASK_CREATE_DELETE = 1 << 11;
export const PERMISSION_TASK_UPDATE_TITLE = 1 << 12;
export const PERMISSION_TASK_UPDATE_DETAILS = 1 << 13;
export const PERMISSION_TASK_UPDATE_IS_DONE = 1 << 14;
export const PERMISSION_TASK_UPDATE_DUE_AT = 1 << 15;
export const PERMISSION_TASK_REORDER = 1 << 16;

export const PERMISSION_ROLE_OWNER = (1 << 17) - 1;

export const PERMISSION_ROLE_EDITOR =
    PERMISSION_ROLE_OWNER ^ PERMISSION_TASK_BOARD_DELETE;

export const PERMISSION_ROLE_WORKER =
    PERMISSION_CONTENT_READ |
    PERMISSION_TASK_UPDATE_IS_DONE |
    PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL;

export const PERMISSION_ROLE_VIEWER = PERMISSION_CONTENT_READ;

export const PERMISSION_ROLE_NONE = 0;

export const PermissionRoleSchema = z.enum(["editor", "worker", "viewer"]);

export type PermissionRole = z.infer<typeof PermissionRoleSchema>;

export const ROLE_TO_PERMISSION: Record<PermissionRole | "none", number> = {
    editor: PERMISSION_ROLE_EDITOR,
    worker: PERMISSION_ROLE_WORKER,
    viewer: PERMISSION_ROLE_VIEWER,
    none: PERMISSION_ROLE_NONE,
};

export const PERMISSION_TO_ROLE: Record<number, PermissionRole> = {
    [PERMISSION_ROLE_EDITOR]: "editor",
    [PERMISSION_ROLE_WORKER]: "worker",
    [PERMISSION_ROLE_VIEWER]: "viewer",
};
