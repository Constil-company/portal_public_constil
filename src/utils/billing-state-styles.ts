import { SubscriptionHistoryResponseStatusEnum } from "../api/subscription";

export const billingStateStyles = {
    [SubscriptionHistoryResponseStatusEnum.Active]: {
        backgroundColor: '#E6FFE2',
        color: '#1E9609',
        label: 'Paid',
    },
    [SubscriptionHistoryResponseStatusEnum.Canceled]: {
        backgroundColor: '#FFE2E2',
        color: '#A70909',
        label: 'Canceled',
    },
    [SubscriptionHistoryResponseStatusEnum.Incomplete]: {
        backgroundColor: '#FFF5E2',
        color: '#E98B1E',
        label: 'Incomplete',
    },
    [SubscriptionHistoryResponseStatusEnum.IncompleteExpired]: {
        backgroundColor: '#FFF5E2',
        color: '#E98B1E',
        label: 'Expired',
    },
    [SubscriptionHistoryResponseStatusEnum.PastDue]: {
        backgroundColor: '#FFF5E2',
        color: '#E98B1E',
        label: 'Past Due',
    },
    [SubscriptionHistoryResponseStatusEnum.Trialing]: {
        backgroundColor: '#E2F0FF',
        color: '#1E5FE9',
        label: 'Trialing',
    },
    [SubscriptionHistoryResponseStatusEnum.Unpaid]: {
        backgroundColor: '#FFE2E2',
        color: '#A70909',
        label: 'Unpaid',
    },
} as const;
