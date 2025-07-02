export class DB {
  private dbStore!: IDBOpenDBRequest;
  private db!: IDBDatabase;
  private store!: IDBObjectStore;
  constructor(
    public dbName: string = 'OllamaBot',
    public version: number = 1
  ) {}
  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dbStore = indexedDB.open(this.dbName);
      this.dbStore.onsuccess = (ev) => {
        const request = ev.target as IDBOpenDBRequest;
        this.db = request.result;
        resolve();
      };
      this.dbStore.onerror = (error) => {
        const event = error.target as IDBOpenDBRequest;
        reject(event.error?.message);
      };
    });
  }
  async createObjStore(
    storeName: string,
    options?: { keyPath?: string; autoIncrement?: boolean },
    index?: boolean,
    index_key?: string
  ): Promise<void> {
    if (!this.db) return;
    if (this.db.objectStoreNames.contains(storeName)) {
      console.warn(`ObjectStore ${storeName} already exists`);
      return;
    }
    return new Promise((resolve, reject) => {
      if (this.db) this.db.close();
      const newVersion = this.db.version + 1 || 1;
      this.dbStore = indexedDB.open(this.db.name, newVersion);
      this.dbStore.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;
        const store = this.db.createObjectStore(storeName, options);
        if (index && index_key) {
          store.createIndex(index_key, index_key, { unique: false });
        }
      };

      this.dbStore.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;
        resolve();
      };

      this.dbStore.onerror = (error) => {
        const event = error.target as IDBOpenDBRequest;
        reject(event.error?.message);
      };
    });
  }
  private getTransaction(
    storeName: string,
    mode: 'readonly' | 'readwrite' = 'readonly'
  ) {
    if (!this.db.objectStoreNames.contains(storeName)) {
      console.warn(`ObjectStore ${storeName} does not exists.`);
      return null;
    }
    const transaction = this.db.transaction(storeName, mode);
    this.store = transaction.objectStore(storeName);
  }
  private getStore(
    storeName: string,
    mode: 'readonly' | 'readwrite' = 'readwrite'
  ) {
    this.getTransaction(storeName, mode);
  }
  add(storeName: string, obj: object): void {
    const store = this.getStore(storeName, 'readwrite');
    const request = this.store.add(obj);
  }
  put(storeName: string, obj: object): void {
    const store = this.getStore(storeName, 'readwrite');
    const request = this.store.put(obj);
  }
  delete(
    storeName: string,
    key: string,
    index: boolean = false,
    indexName?: string
  ): void {
    this.getStore(storeName, 'readwrite');
    let request;
    if (index && indexName) {
      const idxStore = this.store.index(indexName);
      request = idxStore.openCursor(IDBKeyRange.only(key));
      request.onsuccess = (event: any) => {
        const cursor = event.target?.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } else request = this.store.delete(key);
  }

  get(
    storeName: string,
    key: number | string,
    index: boolean = false
  ): Promise<any> {
    const store = this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = this.store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (error) => {
        console.warn(error);
        reject(error);
      };
    });
  }
  getAll(
    storeName: string,
    key?: number | string,
    index: boolean = false,
    indexName?: string
  ): Promise<any> {
    const store = this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      let request;
      if (index && indexName) {
        const idxStore = this.store.index(indexName);
        request = idxStore.getAll(key);
      } else request = this.store.getAll(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (error) => {
        console.warn(error);
        reject(error);
      };
    });
  }
}
