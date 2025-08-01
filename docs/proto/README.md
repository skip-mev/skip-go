# proto

## Osmosis Protobufs

Currently, depending on Osmosis Go modules causes build errors, so we want to use Osmosis gRPC clients without depending on Osmosis Go modules.

In order to do this, we copy Osmosis `.proto` files from the Osmosis repository into our own (located at `proto/osmosis`) and use `make proto-gen` to generate the Go bindings in our own repository.

The process is:

1. Copy only the relevant proto files from https://github.com/osmosis-labs/osmosis/tree/main/proto/osmosis into `proto/osmosis`. For v15.1.2, this means just copying the `poolmanager` directory.
2. Generate the Go bindings in our own repository with `make proto-gen`. You must first uncomment the line that copies Osmosis protobufs to their target directory. This will result in an `osmosis` folder with the Protobuf Go bindings for the `.proto` files in `proto/osmosis`.
3. The Go bindings still have dependencies on the Osmosis Go modules, so replace any `"github.com/osmosis-labs/osmosis..."` dependencies in the generated Go bindings with the corresponding `"github.com/skip-mev/cns/osmosis..."` dependencies to depend on the locally generated ones.
