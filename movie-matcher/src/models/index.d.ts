import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerRoom = {
  readonly id: string;
  readonly name: string;
  readonly members: User[];
}

type LazyRoom = {
  readonly id: string;
  readonly name: string;
  readonly members: User[];
}

export declare type Room = LazyLoading extends LazyLoadingDisabled ? EagerRoom : LazyRoom

export declare const Room: (new (init: ModelInit<Room>) => Room)

type EagerUser = {
  readonly id: string;
  readonly username: string;
}

type LazyUser = {
  readonly id: string;
  readonly username: string;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User)

