declare module 'react-native-watch-connectivity' {
	export interface Watch {
		subscribeToWatchStatecallback(
			callback: (error: Object, watchIsReachable: any) => void
		): void;
	}
}
