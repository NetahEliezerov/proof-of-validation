export type TransactionType = {
    fromAdd: string;
    toAdd: string;
    amount: number;
    timestamp: string;
    transactionHash: string;
    signature: string;
};

export type BlockType = {
    index: number;
    timestamp: string;
    previousBlockHash: string;
    transactions: TransactionType[];
    hash: string;
    validationHash: string;
};

export type NodeType = {
    ip: string;
}
