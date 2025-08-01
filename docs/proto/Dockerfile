FROM golang:1.22-alpine
WORKDIR /src/

RUN go install github.com/bufbuild/buf/cmd/buf@v1.19.0
RUN go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@v2.16.0
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28.1
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.3.0
RUN go install github.com/nefixestrada/protoc-gen-go-grpc-mock@v0.2.0
