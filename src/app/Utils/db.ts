/**
 *  This calss implements a simple IndexedDB wrapper for managing
 *  object stores and performing CRUD operations.
 *  It provides methods to open a database, create object stores,
 *  add, put, delete, and get data from the object stores.
 */
export class DB {
  private dbStore!: IDBOpenDBRequest;
  private db!: IDBDatabase;
  private store!: IDBObjectStore;
  constructor(
    public dbName: string = 'OllamaBot',
    public version: number = 1
  ) {}

  /**
   * Opens the IndexedDB database with the specified name and version.
   * If the database does not exist, it will be created.
   * @returns A promise that resolves when the database is opened successfully.
   */
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

  /**
   *
   * @param storeName  The name of the object store to be created.
   * @param options Options for the object store, such as keyPath and autoIncrement.
   * @param index If true, an index will be created on the object store.
   * @param index_key Key for the index to be created on the object store.
   * @returns
   */
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
      const newVersion = this.db.version + 1 || 1; // increment version if db exists
      // Open the database with the new version
      this.dbStore = indexedDB.open(this.db.name, newVersion);

      // two main methods are used to handle the database upgrade process
      // onupgradeneeded is called when the database is created or upgraded
      // onsuccess is called when the database is opened successfully
      // onerror is called when there is an error opening the database.
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

  // This method is used to get a transaction for the specified object store.
  // It checks if the object store exists, and if it does, it creates a transaction
  // with the specified mode (readonly or readwrite).
  // In IndexedDB, a transaction is a way to perform multiple operations on the database
  // in a single atomic operation. It ensures that all operations are completed successfully
  // or none of them are applied, maintaining the integrity of the database.
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

  // This method is used to get the object store for the specified store name.
  private getStore(
    storeName: string,
    mode: 'readonly' | 'readwrite' = 'readwrite'
  ) {
    this.getTransaction(storeName, mode);
  }

  // This method is used to add an object to the specified object store.
  add(storeName: string, obj: object): void {
    const store = this.getStore(storeName, 'readwrite');
    const request = this.store.add(obj);
  }

  // This method is used to update an object in the specified object store.
  put(storeName: string, obj: object): void {
    const store = this.getStore(storeName, 'readwrite');
    const request = this.store.put(obj);
  }

  // This method is used to delete an object from the specified object store.
  delete(
    storeName: string,
    key: string,
    index: boolean = false,
    indexName?: string
  ): void {
    this.getStore(storeName, 'readwrite');
    let request;
    // If index is true, it will delete the object from the index store.
    // If indexName is provided, it will use that index to delete the object.
    // This way multiple objects can be deleted based on the index.
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
      // By default, it will delete the object from the main store.
    } else request = this.store.delete(key);
  }

  // This method is used to get an object from the specified object store.
  // It takes the store name, key, and an optional index parameter.
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

  /**
   *
   * @param storeName The name of the object store to retrieve data from.
   * @param key The key of the object to retrieve. If not provided, all objects will be retrieved.
   * @param index Flag to indicate if the retrieval should be done using an index.
   * @param indexName Index name to be used for retrieval if index is true.
   * @returns
   */
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
