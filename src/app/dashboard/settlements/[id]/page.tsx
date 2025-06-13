  <div className="space-y-6">
    {/* Settlement Information */}
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Settlement Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Settlement ID</p>
              <p className="font-medium">{settlement.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Claim ID</p>
              <p className="font-medium">{settlement.claimId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Client Name</p>
              <p className="font-medium">{settlement.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="font-medium">${settlement.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge
                className={cn(
                  'capitalize',
                  statusColors[settlement.status as keyof typeof statusColors]
                )}
              >
                {settlement.status.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Type</p>
              <Badge
                variant="secondary"
                className={cn(
                  'capitalize',
                  typeColors[settlement.type as keyof typeof typeColors]
                )}
              >
                {settlement.type.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <p className="font-medium">{settlement.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Name</p>
              <p className="font-medium">{settlement.bankDetails.accountName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Number</p>
              <p className="font-medium">{settlement.bankDetails.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
              <p className="font-medium">{settlement.bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Routing Number</p>
              <p className="font-medium">{settlement.bankDetails.routingNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Timeline */}
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-2 h-2 rounded-full mt-2',
                  item.status === 'completed' ? 'bg-primary' : 'bg-muted'
                )} />
                {index !== timeline.length - 1 && (
                  <div className="w-0.5 h-full bg-border" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
                {item.description && (
                  <p className="mt-1 text-sm">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Review Section */}
    {settlement.status === 'PENDING_APPROVAL' && (
      <Card>
        <CardHeader>
          <CardTitle>Review Settlement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Review Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this settlement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReject}
              className="w-full sm:w-auto"
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              className="w-full sm:w-auto"
            >
              Approve Settlement
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  </div> 